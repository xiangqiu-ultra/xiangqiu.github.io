import socket
import threading
import json
import base64
import hashlib

# Server configuration
HOST = '0.0.0.0'  # Listen on all interfaces
PORT = 8765       # Port to listen on

# Store connected clients and their usernames
clients = {}
# Store chat history
chat_history = []

# Broadcast message to all clients
def broadcast(message):
    for client in clients:
        try:
            send_ws_message(client, json.dumps(message))
        except:
            # Remove disconnected client
            del clients[client]

# Send WebSocket message
def send_ws_message(client, message):
    # WebSocket frame format: 0x81 (FIN + text frame) + length + payload
    payload = message.encode('utf-8')
    length = len(payload)
    
    if length <= 125:
        frame = b'\x81' + length.to_bytes(1, 'big') + payload
    elif length <= 65535:
        frame = b'\x81\x7E' + length.to_bytes(2, 'big') + payload
    else:
        frame = b'\x81\x7F' + length.to_bytes(8, 'big') + payload
    
    client.send(frame)

# Handle WebSocket handshake
def handle_handshake(client, data):
    # Parse handshake request
    request = data.decode('utf-8')
    lines = request.split('\r\n')
    
    # Find Sec-WebSocket-Key
    sec_key = None
    for line in lines:
        if line.startswith('Sec-WebSocket-Key:'):
            sec_key = line.split(':')[1].strip()
            break
    
    if sec_key:
        # Generate response key
        magic_string = b'258EAFA5-E914-47DA-95CA-C5AB0DC85B11'
        combined = sec_key.encode('utf-8') + magic_string
        response_key = base64.b64encode(hashlib.sha1(combined).digest()).decode('utf-8')
        
        # Send handshake response
        response = f"HTTP/1.1 101 Switching Protocols\r\n"
        response += "Upgrade: websocket\r\n"
        response += "Connection: Upgrade\r\n"
        response += f"Sec-WebSocket-Accept: {response_key}\r\n"
        response += "\r\n"
        
        client.send(response.encode('utf-8'))
        return True
    return False

# Decode WebSocket frame
def decode_ws_frame(data):
    if len(data) < 2:
        return None
    
    # Extract FIN and opcode
    fin = (data[0] & 0x80) != 0
    opcode = data[0] & 0x0F
    
    # Extract mask and length
    mask = (data[1] & 0x80) != 0
    length = data[1] & 0x7F
    
    # Handle extended length
    if length == 126:
        length = int.from_bytes(data[2:4], 'big')
        mask_start = 4
    elif length == 127:
        length = int.from_bytes(data[2:10], 'big')
        mask_start = 10
    else:
        mask_start = 2
    
    # Extract payload
    if mask:
        mask_key = data[mask_start:mask_start+4]
        payload_start = mask_start + 4
        payload = data[payload_start:payload_start+length]
        
        # Apply mask
        decoded = bytearray()
        for i in range(len(payload)):
            decoded.append(payload[i] ^ mask_key[i % 4])
        
        try:
            return decoded.decode('utf-8')
        except UnicodeDecodeError:
            return None
    else:
        payload_start = mask_start
        payload = data[payload_start:payload_start+length]
        try:
            return payload.decode('utf-8')
        except UnicodeDecodeError:
            return None

# Handle client connections
def handle_client(client, addr):
    username = None
    authenticated = False
    
    try:
        # Receive handshake
        data = client.recv(1024)
        if not handle_handshake(client, data):
            print(f"Handshake failed for {addr}")
            client.close()
            return
        
        authenticated = True
        print(f"WebSocket connection established with {addr}")
        
        # Receive username
        while True:
            data = client.recv(1024)
            if not data:
                break
            
            message = decode_ws_frame(data)
            if message:
                username = message.strip()
                clients[client] = username
                break
        
        if username:
            # Send chat history to new client
            for msg in chat_history:
                send_ws_message(client, json.dumps(msg))
            
            # Broadcast user joined message
            join_msg = {
                'type': 'user-joined',
                'username': username,
                'message': f"{username} 加入了聊天室！"
            }
            chat_history.append(join_msg)
            broadcast(join_msg)
            
            # Broadcast updated user list
            user_list_msg = {
                'type': 'user-list',
                'users': list(clients.values())
            }
            broadcast(user_list_msg)
            
            # Handle messages
            while True:
                data = client.recv(1024)
                if not data:
                    break
                
                # Parse message
                message = decode_ws_frame(data)
                if message:
                    try:
                        msg = json.loads(message)
                        if msg['type'] == 'chat':
                            # Add to chat history
                            chat_msg = {
                                'type': 'chat',
                                'username': username,
                                'message': msg['message'],
                                'timestamp': msg['timestamp']
                            }
                            chat_history.append(chat_msg)
                            # Broadcast to all clients
                            broadcast(chat_msg)
                    except Exception as e:
                        print(f"Error parsing message: {e}")
        
    except Exception as e:
        print(f"Error handling client {addr}: {e}")
    finally:
        # Clean up
        if client in clients:
            username = clients[client]
            del clients[client]
            client.close()
            
            # Broadcast user left message
            leave_msg = {
                'type': 'user-left',
                'username': username,
                'message': f"{username} 离开了聊天室！"
            }
            chat_history.append(leave_msg)
            broadcast(leave_msg)
            
            # Broadcast updated user list
            user_list_msg = {
                'type': 'user-list',
                'users': list(clients.values())
            }
            broadcast(user_list_msg)

# Start server
def start_server():
    server = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    server.bind((HOST, PORT))
    server.listen()
    print(f"Chat server started on {HOST}:{PORT}")
    
    try:
        while True:
            client, addr = server.accept()
            print(f"Connected to {addr}")
            # Start new thread for each client
            threading.Thread(target=handle_client, args=(client, addr), daemon=True).start()
    except KeyboardInterrupt:
        print("Server shutting down...")
    finally:
        server.close()

if __name__ == "__main__":
    start_server()