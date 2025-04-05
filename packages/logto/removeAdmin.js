import { parseArgs } from "node:util";

function showHelp() {
  console.error(`
Usage:
  node ./removeAdmin.js --appSecret=<secret> --username=<username> [--baseUrl=<url>]

Required Parameters:
  --appSecret   Application secret
  --username    Admin username to remove

Optional Parameters:
  --baseUrl     Logto server URL (default: http://localhost:3002)

Environment Variables:
  APP_SECRET            Same as --appSecret
  LOGTO_ADMIN_USERNAME Same as --username
  BASE_URL             Same as --baseUrl
`);
  process.exit(1);
}

async function getAccessToken(baseUrl, appSecret) {
  const response = await fetch(`${baseUrl}/oidc/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: "m-admin",
      client_secret: appSecret,
      resource: "https://admin.logto.app/api",
      scope: "all",
    }),
  });
  if (!response.ok) {
    throw new Error(`Failed to get access token: ${response.statusText}`);
  }
  const data = await response.json();
  return data.access_token;
}

async function getUserByUsername(baseUrl, accessToken, username) {
  const searchParams = new URLSearchParams([
    ["search.username", username],
    ["mode.username", "exact"],
  ]);

  const response = await fetch(
    `${baseUrl}/api/users?${searchParams.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json",
      },
    },
  );

  if (!response.ok) {
    throw new Error(`Failed to find user: ${response.statusText}`);
  }

  const data = await response.json();
  return data[0]?.id;
}

async function removeUserFromOrganization(baseUrl, accessToken, userId) {
  const response = await fetch(
    `${baseUrl}/api/organizations/t-default/users/${userId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );
  if (!response.ok) {
    throw new Error(
      `Failed to remove user from organization: ${response.statusText}`,
    );
  }
}

async function deleteUser(baseUrl, accessToken, userId) {
  const response = await fetch(`${baseUrl}/api/users/${userId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  if (!response.ok) {
    throw new Error(`Failed to delete user: ${response.statusText}`);
  }
}

async function main() {
  const config = {
    baseUrl: "http://localhost:3002",
    appSecret: "",
    username: "",
  };

  try {
    console.log("test test", config);
    console.log("Getting access token...");
    const accessToken = await getAccessToken(config.baseUrl, config.appSecret);

    console.log(`Finding user ${config.username}...`);
    const userId = await getUserByUsername(
      config.baseUrl,
      accessToken,
      config.username,
    );

    if (!userId) {
      throw new Error(`User ${config.username} not found`);
    }

    console.log("Removing user from organization...");
    await removeUserFromOrganization(config.baseUrl, accessToken, userId);

    console.log("Deleting user...");
    await deleteUser(config.baseUrl, accessToken, userId);

    console.log(
      `User ${config.username} (ID: ${userId}) removed successfully!`,
    );
  } catch (error) {
    console.error("Error:", error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

main();
