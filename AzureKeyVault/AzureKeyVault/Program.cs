using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Azure.KeyVault;
using Microsoft.Azure.KeyVault.Models;
using Microsoft.IdentityModel.Clients.ActiveDirectory;

namespace AzureKeyVault
{
	class Program
	{
		private static KeyVaultClient keyVaultClient;
		private static Utils utils;

		static void Main(string[] args)
		{
			Task mainTask = MainAsync(args);
			mainTask.Wait();
		}

		static async Task MainAsync(string[] args)
		{
			utils = new Utils();

			await utils.GetSecret();
			Console.WriteLine(utils.key.Value.ToString());
			Console.ReadLine();
		}
	}
}
