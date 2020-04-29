#pragma once
#include <vector>
#include <string>

namespace StringManipulation
{
	std::vector<std::string> split(std::string& str, const std::string& delim)
	{
		std::vector<std::string> tokens = std::vector<std::string>();
		std::string strCopy = str;

		std::size_t pos = 0;
		std::string token;

		while ((pos = strCopy.find(delim)) != std::string::npos) {
			token = strCopy.substr(0, pos);
			strCopy.erase(0, pos + delim.length());

			tokens.push_back(token);
		}

		if (strCopy.length() > 0)
			tokens.push_back(strCopy);

		return tokens;
	}

	std::string concat(std::vector<std::string>& strings, const std::string& delim = "")
	{
		std::string result;

		for (std::size_t i = 0; i < strings.size(); i++) {
			result += strings[i];
			if ((i + 1) != strings.size())
				result += delim;
		}

		return result;
	}
}
