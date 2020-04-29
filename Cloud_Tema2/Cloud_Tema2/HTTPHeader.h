#pragma once

#include "StringManipulation.h"

#include <string>
#include <vector>

class HTTPHeader
{

public:
	std::string key;
	std::string value;

public:
	
	HTTPHeader(std::string& key, std::string& value) : key(key), value(value) {};

	std::string Serialize() {
		std::string header;
		header += this->key;
		header += ": ";
		header += this->value;
		header += "\r\n";

		return header;
	}

	static HTTPHeader Deserialize(std::string& header)
	{
		std::vector<std::string> chunks = StringManipulation::split(header, " ");

		std::string key = chunks[0].substr(0, chunks[0].size() - 1);

		chunks.erase(chunks.begin());

		std::string value = StringManipulation::concat(chunks, " ");

		return HTTPHeader(key, value);
	}
};

