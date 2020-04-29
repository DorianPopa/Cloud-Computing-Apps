#pragma once

//#define _WINSOCK_DEPRECATED_NO_WARNINGS

#include <windows.h>
#include <cstdio>

#pragma comment(lib, "Ws2_32.lib")

class ServerListener
{
	SOCKET				ReceivingSocket = INVALID_SOCKET;
	int					Port;
	size_t				BufferSize;
	bool				ServerRunning = false;

	static void ClientHandler(SOCKET ClientSocket, size_t BufferSize);


public:
	ServerListener(int Port = 4000, size_t BufferSize = 8192);
	void StartServer();
	void StopServer();

	

	~ServerListener();
};

