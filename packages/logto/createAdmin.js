import { parseArgs } from "node:util";

function showHelp() {
  console.error(`
Usage:
  node ./createAdmin.js --appSecret=<secret> --username=<username> --password=<password> [--baseUrl=<url>]

Required Parameters:
  --appSecret   Application secret
  --username    Admin username to create
  --password    Admin password to create

Optional Parameters:
  --baseUrl     Logto server URL (default: http://localhost:3002)

Environment Variables:
  APP_SECRET            Same as --appSecret
  LOGTO_ADMIN_USERNAME Same as --username
  LOGTO_ADMIN_PASSWORD Same as --password
  BASE_URL             Same as --baseUrl

Notes:
  To get APP_SECRET, you can use one of these SQL queries:

  1. Using Docker Compose:
     docker compose exec -it postgres bash -c 'PGPASSWORD=$POSTGRES_PASSWORD psql -A -t -U postgres -d logto -c "select secret from applications where id = \\'m-admin\\';"'

  2. Direct PostgreSQL access:
     psql -U postgres -d logto -c "select secret from applications where id = 'm-admin';"
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
async function createUser(baseUrl, accessToken, username, password) {
  const response = await fetch(`${baseUrl}/api/users`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username,
      password,
    }),
  });
  if (!response.ok) {
    throw new Error(`Failed to create user: ${response.statusText}`);
  }
  const data = await response.json();
  return data.id;
}
async function addUserToOrganization(baseUrl, accessToken, userId) {
  const response = await fetch(`${baseUrl}/api/organizations/t-default/users`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      userIds: [userId],
    }),
  });
  if (!response.ok) {
    throw new Error(
      `Failed to add user to organization: ${response.statusText}`,
    );
  }
}
async function assignOrganizationRole(baseUrl, accessToken, userId) {
  const response = await fetch(
    `${baseUrl}/api/organizations/t-default/users/roles`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userIds: [userId],
        organizationRoleIds: ["admin"],
      }),
    },
  );
  if (!response.ok) {
    throw new Error(
      `Failed to assign organization role: ${response.statusText}`,
    );
  }
}
async function getRoles(baseUrl, accessToken) {
  const response = await fetch(`${baseUrl}/api/roles?type=User`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  if (!response.ok) {
    throw new Error(`Failed to get roles: ${response.statusText}`);
  }
  const data = await response.json();
  return data;
}
async function assignUserRoles(baseUrl, accessToken, userId, roleIds) {
  const response = await fetch(`${baseUrl}/api/users/${userId}/roles`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      roleIds,
    }),
  });
  if (!response.ok) {
    throw new Error(`Failed to assign user roles: ${response.statusText}`);
  }
}
async function updateSignInMode(baseUrl, accessToken) {
  const response = await fetch(`${baseUrl}/api/sign-in-exp`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      tenantId: "admin",
      signInMode: "SignIn",
    }),
  });
  if (!response.ok) {
    throw new Error(`Failed to update sign-in mode: ${response.statusText}`);
  }
}
async function main() {
  const config = {
    baseUrl: "http://localhost:3002",
    appSecret: "",
    username: "",
    password: "",
  };

  try {
    console.log("test test", config);
    console.log("Getting access token...");
    const accessToken = await getAccessToken(config.baseUrl, config.appSecret);
    console.log("Creating user...");
    const userId = await createUser(
      config.baseUrl,
      accessToken,
      config.username,
      config.password,
    );
    console.log(`User created with ID: ${userId}`);
    console.log("Adding user to organization...");
    await addUserToOrganization(config.baseUrl, accessToken, userId);
    console.log("Assigning organization role...");
    await assignOrganizationRole(config.baseUrl, accessToken, userId);
    console.log("Getting roles...");
    const roles = await getRoles(config.baseUrl, accessToken);
    const roleIds = roles.map((role) => role.id);
    console.log("Assigning user roles...");
    await assignUserRoles(config.baseUrl, accessToken, userId, roleIds);
    console.log("Updating sign-in mode to SignIn...");
    await updateSignInMode(config.baseUrl, accessToken);
    console.log("Admin user creation completed successfully!");
    console.log(`Username: ${config.username}`);
  } catch (error) {
    console.error("Error:", error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

main();
