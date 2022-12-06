## Developer Token 

1. In [Adobe AdminConsole](https://adminconsole.adobe.com/) ensure you, the developer, are a member of:
    + __Cloud Manager - Developer__ IMS Product Profile (grants access to AEM Developer Console)
    + Either the __AEM Administrators__ or __AEM Users__ IMS Product Profile for the AEM environment's service the access token will integrate with
    + Sandbox AEM as a Cloud Service environments only require membership in either the __AEM Administrators__ or __AEM Users__ Product Profile
1. Log in to [Adobe Cloud Manager](https://my.cloudmanager.adobe.com)
1. Open the Program containing the AEM as a Cloud Service environment to integrate with
1. Tap the __ellipsis__ next to the environment in the __Environments__ section, and select __Developer Console__
1. Tap in the __Integrations__ tab
1. Tap __Get Local Development Token__ button
1. Tap on the __download button__ in the top left corner to download the JSON file containing `accessToken` value, and save the JSON file to a safe location on your development machine.
    + This is your 24 hour, developer access token to the AEM as a Cloud Service environment. 

![AEM Developer Console - Integrations - Get Local Development Token](https://experienceleague.adobe.com/docs/experience-manager-learn/assets/developer-console.png?lang=en)


