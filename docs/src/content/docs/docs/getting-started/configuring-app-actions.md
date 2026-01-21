---
title: "Configuring App Actions"
description: "Make sure RocketSim App Actions work for your recent builds"
---

A major part of RocketSim’s functionality is based on so-called App Actions. They’re configured based on your app’s primary target bundle identifier and allow you to perform the following actions:

- Test deeplinks (Universal Links)
- Test Push Notifications
- Simulate Locations (Single Locations & Routes)
- Simulate slow networking conditions using the Network Speed Control
- Reset permissions (E.g., location access, photo access)

## Create a new App Actions Group

1. Start by opening the Settings window from either the Status Bar menu or the side window more menu:
    
    ![CleanShot 2025-01-21 at 13.35.41@2x.png](./configuring-app-actions/CleanShot_2025-01-21_at_13.35.412x.png)
    
2. Select the App Actions tab and create a new group:

![CleanShot 2023-11-01 at 11.30.57@2x.png](./configuring-app-actions/CleanShot_2023-11-01_at_11.30.572x.png)

1. Provide the bundle identifier for your recent build. If you’ve already build your app before configuring, RocketSim will be able to suggest your recent build.
    
    ![CleanShot 2023-11-01 at 11.32.58@2x.png](./configuring-app-actions/CleanShot_2023-11-01_at_11.32.582x.png)
    
2. Press the **Add** button and start adding an App Action. For example, start by adding a deeplink for a basic website:
    
    ![CleanShot 2023-11-01 at 11.35.29@2x.png](./configuring-app-actions/CleanShot_2023-11-01_at_11.35.292x.png)
    
3. Go back to the Simulator and notice that your deeplink shows up after selecting the Recent Build matching your App Action Group:
    
    ![CleanShot 2025-01-21 at 13.37.47@2x.png](./configuring-app-actions/CleanShot_2025-01-21_at_13.37.472x.png)
    
4. Click on your App Action and validate that it correctly opens the configured deeplink:
    
    ![CleanShot 2025-01-21 at 13.38.31@2x.png](./configuring-app-actions/CleanShot_2025-01-21_at_13.38.312x.png)
    

## Exploring all App Actions

Well done, you’ve configured your first App Actions group and executed a deeplink in the Simulator! 

This is just the beginning, there’s much more to discover. While you’re at it, how about creating app actions for locations and Push Notifications?

You can also explore the Network Speed Control, Relaunch buttons, or permissions section. I’m sure there are many features that will help you build apps faster.
