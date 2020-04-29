// Cloud_Tema2.cpp : This file contains the 'main' function. Program execution begins and ends there.
//

#define _WINSOCK_DEPRECATED_NO_WARNINGS

#include "ServerListener.h"

#include <windows.h>
#include <iostream>

#pragma comment(lib, "Ws2_32.lib")

int main()
{
	ServerListener().StartServer();
	return 0;
}

