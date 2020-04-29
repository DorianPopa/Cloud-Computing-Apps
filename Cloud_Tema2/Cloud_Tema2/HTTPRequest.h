#pragma once

#include "HTTPHeader.h"
#include <string>
#include <map>

using namespace std;

class HTTPRequest 
{
public:
	map<string, HTTPHeader> Headers;
	string Method;
	string Resource;
	string Body;

	HTTPRequest(string& method, string& resource, string& body, map<string, HTTPHeader>& headers) :
		Method(method), Resource(resource), Body(body), Headers(headers) {};

	static HTTPRequest Deserialize(string& request)
	{
		const string NL = "\r\n";

		vector<string> chunks = StringManipulation::split(request, NL + NL);
		
		string HeaderChunk = chunks[0];
		chunks.erase(chunks.begin());
		string Body = StringManipulation::concat(chunks);

		vector<string> headerLines = StringManipulation::split(HeaderChunk, NL);

		vector<string> firstHeaderLine = StringManipulation::split(headerLines[0], " ");
		string Method = firstHeaderLine[0];
		string Resource = firstHeaderLine[1];

		map<string, HTTPHeader> headers;
		for (std::size_t i = 1; i < headerLines.size(); i++)
		{
			if (headerLines[i].size() > 0)
			{
				HTTPHeader header = HTTPHeader::Deserialize(headerLines[i]);
				headers.insert(make_pair(header.key	,header));
			}
		}

		return HTTPRequest(Method, Resource, Body, headers);
	}
};