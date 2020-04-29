#include "ServerListener.h"

#include "HTTPRequest.h"

#include <iostream>
#include <cstdlib>
#include <future>
#include <chrono>
#include <thread>
#include <sstream>
#include <map>


ServerListener::ServerListener(int Port, size_t BufferSize)
{
	WSADATA	wsaData;

	this->Port = Port;
	this->BufferSize = BufferSize;
	this->ServerRunning = true;
	this->ReceivingSocket = INVALID_SOCKET;


	// Init Winsock
	if (WSAStartup(MAKEWORD(2, 2), &wsaData) != 0)
	{
		printf("Server: WSAStartup failed with error %ld\n", WSAGetLastError());
		ServerRunning = false;
	}
	else
		printf("Server: The Winsock DLL status is %s.\n", wsaData.szSystemStatus);
}

ServerListener::~ServerListener()
{
	printf("Server: Cleaning up...\n");
	if (WSACleanup() != 0)
		printf("Server: WSACleanup() failed!Error code : %ld\n", WSAGetLastError());
	else
		printf("Server: WSACleanup() is OK\n");
}

void ServerListener::StartServer()
{
	SOCKADDR_IN	ReceiverAddr;


	// Create a new socket
	ReceivingSocket = socket(AF_INET, SOCK_STREAM, IPPROTO_TCP);
	if (ReceivingSocket == INVALID_SOCKET)
	{
		printf("Server: Error at socket() : %ld\n", WSAGetLastError());
		WSACleanup();
		ServerRunning = false;
	}
	else
		printf("Server: socket() is OK!\n");



	// Set up a SOCKADDR_IN structure
	ReceiverAddr.sin_family = AF_INET;	// The IPv4 family
	ReceiverAddr.sin_port = htons(Port);
	ReceiverAddr.sin_addr.s_addr = htonl(INADDR_ANY);	// Recieve from any address



	// Bind the address to the socket
	if (::bind(ReceivingSocket, (SOCKADDR*)&ReceiverAddr, sizeof(ReceiverAddr)) == SOCKET_ERROR)
	{
		printf("Server: bind() failed! Error: %ld.\n", WSAGetLastError());
		closesocket(ReceivingSocket);
		WSACleanup();
		ServerRunning = false;
	}
	else
		printf("Server: bind() is OK!\n");


	
	SOCKADDR* addrinfo = (SOCKADDR*)&ReceiverAddr;
	int addrSize = sizeof(ReceiverAddr);

	// Print final server information
	getsockname(ReceivingSocket, addrinfo, &addrSize);
	printf("Server: Receiving IP(s) used: %s\n", inet_ntoa(ReceiverAddr.sin_addr));
	printf("Server: Receiving port used: %d\n", htons(ReceiverAddr.sin_port));
	printf("Server: I\'m ready to receive data...\n");
	

	std::map<SOCKET, std::thread> threads;

	while (ServerRunning) {
		SOCKET ClientSocket;
		try {
			ClientSocket = accept(ReceivingSocket, NULL, NULL);
			if (ClientSocket == INVALID_SOCKET) {
				throw std::runtime_error("Failed to accept");
			}
		}
		catch(std::runtime_error e){
			printf(e.what());
			continue;
		}
		
		printf("Server: Client Connected...\n");
		threads[ClientSocket] = std::thread(ServerListener::ClientHandler, ClientSocket, BufferSize);
	}
}

void ServerListener::ClientHandler(SOCKET ClientSocket, size_t BufferSize)
{
	int					BufLength = BufferSize;
	char*				ReceiveBuf;
	int					BytesReceived = 1;
	SOCKADDR_IN			SenderAddr;
	int					SenderAddrSize = sizeof(SenderAddr);

	ReceiveBuf = (char*)malloc(BufLength * sizeof(char));

	if (getpeername(ClientSocket, (SOCKADDR*)(&SenderAddr), &SenderAddrSize) == SOCKET_ERROR)	
		goto cleanup;

	while (true) {
		std::string RequestRaw = "";

		while (BytesReceived > 0) {
			BytesReceived = recv(ClientSocket, ReceiveBuf, BufLength, 0);
			if(BytesReceived > 0)
				RequestRaw.append(ReceiveBuf);
		}
		HTTPRequest currentRequest = HTTPRequest::Deserialize(RequestRaw);

		map<string, HTTPHeader>::iterator connectionStatus_it = currentRequest.Headers.find("Connection");
		if (connectionStatus_it != currentRequest.Headers.end() && connectionStatus_it->second.value == "close") {
			goto cleanup;
		}

		std::string responseHeaders = "";
		std::string responseBody = "";

		/////// THIS IS WHERE STUFF WILL BE DONE ////////////









		
		std::string response = responseHeaders + responseBody;
		send(ClientSocket, response.c_str(), strlen(response.c_str()), 0);
	}



cleanup:
	// When the client closed the connection close the client socket.
	printf("Server: Finished receiving.Closing the ClientSocket...\n");
	if (closesocket(ClientSocket) != 0)
		printf("Server: closesocket(ClientSocket) failed!Error code : %ld\n", WSAGetLastError());
	else
		printf("Server: closesocket(ClientSocket) is OK...\n");
}

void ServerListener::StopServer()
{
	// When the application finished receiving close the socket.
	printf("Server: Finished receiving.Closing the listening socket...\n");
	if (closesocket(ReceivingSocket) != 0)
		printf("Server: closesocket() failed!Error code : %ld\n", WSAGetLastError());
	else
		printf("Server: closesocket() is OK...\n");
}


