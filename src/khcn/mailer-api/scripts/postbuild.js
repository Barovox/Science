const fs = require("fs");
const path = require("path");

const distDir = path.join(__dirname, "../dist");
const webConfigPath = path.join(distDir, "web.config");

const webConfigContent = `<?xml version="1.0" encoding="utf-8"?>
<configuration>
  <system.webServer>
    <!-- Note the iisnode handler to execute the index.js file. -->
    <handlers>
      <add name="iisnode" path="index.js" verb="*" modules="iisnode" />
    </handlers>
    
    <rewrite>
      <rules>
        <!-- Ignore the logs folder and debug files of iisnode. -->
        <rule name="NodeInspector" patternSyntax="ECMAScript" stopProcessing="true">
          <match url="^index.js/_inspect" />
        </rule>

        <!-- Redirect all requests to index.js (except for the actual static files). -->
        <rule name="DynamicContent">
          <conditions>
            <add input="{REQUEST_FILENAME}" matchType="IsFile" negate="True" />
          </conditions>
          <action type="Rewrite" url="index.js" />
        </rule>
      </rules>
    </rewrite>

    <!-- Configure the settings for iisnode -->
    <iisnode 
      watchedFiles="web.config;*.js"
      loggingEnabled="true"
      logDirectory="iisnode"
      debuggingEnabled="false"
      devErrorsEnabled="false"
    />
  </system.webServer>
  <system.web>
    <customErrors mode="Off" />
  </system.web>
</configuration>
`;

if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

fs.writeFileSync(webConfigPath, webConfigContent, "utf8");
console.log("Successfully created dist/web.config");
