import ctypes

# Allocate a buffer of 8 bytes on the heap
buffer = ctypes.create_string_buffer(8)

# Intentionally write more than 8 bytes to the buffer (overflow)
data = b"A" * 16
ctypes.memmove(buffer, data, len(data))  # Vulnerable: writes 16 bytes into an 8-byte buffer

print(buffer.raw)
print('h')
