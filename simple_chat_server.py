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
    for client in list(clients.keys()):
        try:
            send_ws_message(client, json.dumps(message))
        except Exception as e:
            print(f"Error broadcasting: {e}")
            # Remove disconnected client
            if client in clients:
                del clients[client]

# Send WebSocket message
def send_ws_message(client, message):
    """Send a message over WebSocket"""
    payload = message.encode('utf-8')
    length = len(payload)
    
    # Create WebSocket frame
    if length <= 125:
        frame = b'\x81' + length.to_bytes(1, 'big') + payload
    elif length <= 65535:
        frame = b'\x81\x7E' + length.to_bytes(2, 'big') + payload
    else:
        frame = b'\x81\x7F' + length.to_bytes(8, 'big') + payload
    
    client.send(frame)

# Handle WebSocket handshake
def handle_handshake(client, data):
    """Handle WebSocket handshake"""
    try:
        request = data.decode('utf-8')
        
        # Extract Sec-WebSocket-Key
        lines = request.split('\r\n')
        sec_key = None
        for line in lines:
            if line.startswith('Sec-WebSocket-Key:'):
                sec_key = line.split(':', 1)[1].strip()
                break
        
        if not sec_key:
            return False
        
        # Generate response key
        magic = b'258EAFA5-E914-47DA-95CA-C5AB0DC85B11'
        response_key = base64.b64encode(hashlib.sha1(sec_key.encode() + magic).digest()).decode()
        
        # Send handshake response
        response = (
            'HTTP/1.1 101 Switching Protocols\r\n'\
            'Upgrade: websocket\r\n'\
            'Connection: Upgrade\r\n'\
            f'Sec-WebSocket-Accept: {response_key}\r\n'\
            '\r\n'
        )
        client.send(response.encode())
        return True
    except Exception as e:
        print(f"Handshake error: {e}")
        return False

# Decode WebSocket frame
def decode_ws_frame(data):
    """Decode WebSocket frame"""
    if len(data) < 2:
        return None
    
    # Get frame info
    fin = (data[0] & 0x80) != 0
    opcode = data[0] & 0x0F
    masked = (data[1] & 0x80) != 0
    length = data[1] & 0x7F
    
    # Get payload length
    if length == 126:
        length = int.from_bytes(data[2:4], 'big')
        mask_start = 4
    elif length == 127:
        length = int.from_bytes(data[2:10], 'big')
        mask_start = 10
    else:
        mask_start = 2
    
    # Get payload
    if masked:
        mask = data[mask_start:mask_start+4]
        payload_start = mask_start + 4
        payload = data[payload_start:payload_start+length]
        
        # Apply mask
        decoded = bytearray()
        for i in range(len(payload)):
            decoded.append(payload[i] ^ mask[i % 4])
        return decoded.decode('utf-8', errors='ignore')
    else:
        payload_start = mask_start
        payload = data[payload_start:payload_start+length]
        return payload.decode('utf-8', errors='ignore')

# Handle client connection
def handle_client(client, addr):
    """Handle a client connection"""
    username = None
    
    try:
        # Receive handshake
        data = client.recv(4096)
        if not handle_handshake(client, data):
            print(f"Handshake failed for {addr}")
            client.close()
            return
        
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
            print(f"User {username} connected")
            
            # Send chat history
            for msg in chat_history:
                send_ws_message(client, json.dumps(msg))
            
            # Broadcast user joined
            join_msg = {
                'type': 'user-joined',
                'username': username,
                'message': f"{username} 加入了聊天室！"
            }
            chat_history.append(join_msg)
            broadcast(join_msg)
            
            # Broadcast user list
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
                
                message = decode_ws_frame(data)
                if message:
                    try:
                        msg = json.loads(message)
                        if msg['type'] == 'chat':
                            chat_msg = {
                                'type': 'chat',
                                'username': username,
                                'message': msg['message'],
                                'timestamp': msg['timestamp']
                            }
                            chat_history.append(chat_msg)
                            broadcast(chat_msg)
                    except Exception as e:
                        print(f"Error parsing message: {e}")
    
    except Exception as e:
        print(f"Error handling client {addr}: {e}")
    
    finally:
        # Clean up
        if client in clients:
            if username:
                print(f"User {username} disconnected")
                
                # Broadcast user left
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
                    'users': [v for k, v in clients.items() if k != client]
                }
                broadcast(user_list_msg)
            
            del clients[client]
        
        try:
            client.close()
        except:
            pass

# Start server
def start_server():
    """Start the chat server"""
    server = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    server.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    server.bind((HOST, PORT))
    server.listen(5)
    
    print(f"Chat server started on ws://{HOST}:{PORT}")
    print("Waiting for connections...")
    
    try:
        while True:
            client, addr = server.accept()
            print(f"New connection from {addr}")
            
            # Start thread for client
            threading.Thread(target=handle_client, args=(client, addr), daemon=True).start()
    
    except KeyboardInterrupt:
        print("\nServer shutting down...")
    
    finally:
        server.close()

if __name__ == "__main__":
    start_server()