# AEM Pure Headless Demo

## Overview

This demo include pure headless and headful content delivered from Experience Fragments.  The intent of this demo is to show how you would connect an application to AEM using GraphQL and Content Services.  The site can be found [here](https://lamontacrook.github.io/aem-pure-headless). It runs independently outside of AEM and can be shared and customized.  

There are 3 possible configurations for this demo.

1. You can use the demo as is from <a href='https://lamontacrook.github.io/aem-pure-headless'>this link</a>.  This will be a fully headless site using GraphQL and Experience Fragments from AEM.  You can use the the View GQL button to share the Request and Response from AEM.  This should be used for quick overviews where you simply want a discuss how a site would use AEM headlessly.

2. If you want to customize the content, you can install [this](https://github.com/lamontacrook/gql-demo-template/releases/download/v0.0.6/gql-demo-0.0.5-SNAPSHOT.zip) package to package manager.  This package includes the models and queries that will be use by the demo.  For the demo content, install [this](https://github.com/lamontacrook/gql-demo-template/releases/download/v0.0.6/gql-demo-template-0.0.6.zip) quicksite creation template using the quicksite creation tool.  This will allow you to create multiple headless sites and customize each differently.  You can find a video to walk you throught this process [here](https://publish-p91555-e868145.adobeaemcloud.com/content/dam/misc/headless-setup.mp4).  After installing, you can use this settings page to point this site to your instance.  Note: the site needs your assets to be published so make sure you have published all the adventures assets and the assets from you newly created site.

![Settings](./public/settings.png)

3. If you want to fully customize the demo, you clone the <a href='https://github.com/lamontacrook/aem-pure-headless'>project</a> and build it locally.  This site does not use an .env file for configuration properties.  Instead it uses this setting page for configuration.  Forthcoming video on how to navigate then project.

### Dependencies

This demo out of the box depends on WKND Site being installed and having the name wknd-site.  This can be changed by editing the fragments that contain references to the experience fragments.  Instruction on how to do can be found on the settings tab after authentication.

![References](./public/references.png)

### Assets & Renditions

All assets need to be publised!  This includes all assets in reference demo and the WKND Experience Fragments and their assets.  Before you do that, however, you need to decide on what renditions you are using.  If you want to use webp renditions then you need to apply the GQL Demo present to all assets in reference demo assets before publishing.  If you would rather use default renditions then within the configuration fragment update the rendition data item to the JSON block below.

``{
  "1280": "cq5dam.web.1280.1280.jpeg",
  "319": "cq5dam.thumbnail.319.319.png",
}``

### Proxy 

In order to avoid CORS errors and configuring your enviroment to allow requests from the app, we have created proxy that can be used.  This will allow you to easily set this up.  While its not manditory, it's a good way to avoid having to run a pipeline.