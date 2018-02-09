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
	public class Utils
	{
		public SecretBundle key;

		public async Task GetSecret()
		{
			var kv = new KeyVaultClient(new KeyVaultClient.AuthenticationCallback(GetToken));
			key = await kv.GetSecretAsync("https://westerosvault.vault.azure.net/secrets/UserRoger/2343c3409cd4402eb55fef0982c42dcc");
		}

		public async Task<string> GetToken(string authority, string resource, string scope)
		{
			var authContext = new AuthenticationContext(authority);
			ClientCredential clientCred = new ClientCredential("dd233631-196a-451f-ab40-7e16c4f61825",
				"oPb3gHAzM5CKcw2WMMVfnN4ewiKIFsmyq6yyRUfepHs=");
			AuthenticationResult result = await authContext.AcquireTokenAsync(resource, clientCred);

			if (result == null)
				throw new InvalidOperationException("Failed to obtain the JWT token");

			return result.AccessToken;
		}
	}
}
