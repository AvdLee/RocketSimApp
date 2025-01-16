import UIKit

struct Feature: Codable {
    enum CodingKeys: String, CodingKey {
        case githubIssueID = "id"
        case title, description, status, isFinished
    }
    enum Status: String, Codable {
        case planned = "Planned"
        case inProgress = "In Progress"
        case implemented = "Implemented"
    }

    let githubIssueID: String
    let title: String
    let description: String?
    let status: Status
    var isFinished: Bool
}

extension Feature {
    init(githubIssueID: String, title: String, description: String? = nil, status: Status) {
        self.githubIssueID = githubIssueID
        self.title = title
        self.description = description
        self.status = status
        self.isFinished = status == .implemented
    }
}

let features: [Feature] = [
    /// Implemented
    .init(githubIssueID: "135", title: "Apple Watch Support", description: "Use RocketSim with the Apple Watch Simulator", status: .implemented),
    .init(githubIssueID: "263", title: "Magnifier Color Picker", description: "Select a color using the Magnifier", status: .implemented),
    .init(githubIssueID: "278", title: "Show distance between rulers", description: "Measure the distance between rulers", status: .implemented),
    .init(githubIssueID: "283", title: "Simulator Airplane Mode", description: "Disable network connection for a specific Simulator app w/o influencing your Mac's connection", status: .implemented),
    .init(githubIssueID: "173", title: "Configurable status bar", description: "Change the status bar of the Simulator", status: .implemented),
    .init(githubIssueID: "165", title: "Dynamic Type Control", description: "Adjust Dynamic Type from the side window", status: .implemented),
    .init(githubIssueID: "125", title: "Constant visible touch indicator", description: "Always show a mouse-following touch indicator during recordings", status: .implemented),
    .init(githubIssueID: "284", title: "Show comparison overlay when focus is lost", description: "Keep the comparison overlay visible when switching to apps like Figma or Sketch", status: .implemented),
    .init(githubIssueID: "286", title: "Locale switcher", description: "Quickly relaunch your app in a different locale w/o the need to restart the Simulator.", status: .implemented),
    .init(githubIssueID: "346", title: "Dark Mode switcher", description: "Allow to switch between dark/light mode from the side window.", status: .implemented),
    .init(githubIssueID: "371", title: "UserDefaults Visual Viewer & Editor", description: "Directly edit and view UserDefaults.", status: .implemented),
    .init(githubIssueID: "353", title: "Automatically update timezone to match location change", description: "Restarts your app with the requested location and updates the timezone for your app accordingly", status: .implemented),
    .init(githubIssueID: "304", title: "Xcode Build Statistics", description: "Get statistics on number of builds, build times, and more. Beautifully graphs to keep track of your projects.", status: .implemented),
    .init(githubIssueID: "282", title: "Allow to search Quick Actions", description: "Filter long lists by searching for a query", status: .implemented),
    .init(githubIssueID: "357", title: "Clipboard copy to/from buttons", description: "Sync the clipboard between your Mac and the Simulator by using copy from/to buttons", status: .implemented),
    .init(githubIssueID: "179", title: "Display HTTP Traffic", description: "Show HTTP Traffic directly next to the Simulator", status: .implemented),
    
    /// Planned
    .init(githubIssueID: "368", title: "Show Magnifier boundaries", description: "Show a square around the zoomed section on top of the Simulator screen for easier coordination", status: .planned),
    .init(githubIssueID: "370", title: "SwiftData Visual Viewer & Editor", description: "Explore and edit SwiftData databases.", status: .planned),
    .init(githubIssueID: "347", title: "Username/Password Quick Action", description: "Allow to fill in account details inside a email/password textfield via a Quick Action.", status: .planned),
    .init(githubIssueID: "345", title: "User Defaults Actions", description: "Add custom bundle identifier-based actions that modify user defaults for your application. Possible replacement to in-app debug views.", status: .planned),
    .init(githubIssueID: "283b", title: "Network Link Conditioner", description: "Apart from Airplane mode, allow to only slow down the network connection for a specific Simulator app w/o influencing your Mac's connection", status: .implemented),
    .init(githubIssueID: "311", title: "Show debugger logs", description: "Show OSLog-based debugger logs next to the simulator with filters for levels like debug, info, and error", status: .planned),
    .init(githubIssueID: "289", title: "Add a wallpaper and padding to screenshots", description: "Beautify screenshots with a gradient background and extra padding", status: .planned),
    .init(githubIssueID: "280", title: "Resize screenshots", description: "Allow resizing the output screenshot to reduce size and resolution", status: .planned),
    .init(githubIssueID: "269", title: "Advanced Simulator Recordings (60FPS, 120FPS, compression config)", description: "Advanced configuration for Simulator recordings, allowing to record in 60FPS, 120FPS or to configure compression.", status: .planned),
    .init(githubIssueID: "193", title: "Configurable Video Output", description: "Export to .MOV instead of .MP4", status: .planned),
    .init(githubIssueID: "236", title: "Allow Save as... for captured thumbnails", description: "Right-click a thumbnail to save as...", status: .planned),
    .init(githubIssueID: "285", title: "Record Mic audio with recordings", description: "Screen recordings with your voice as instructions", status: .planned),
    .init(githubIssueID: "299", title: "Low storage testing", description: "Simulate low storage on the Simulator to trigger No Space Left errors", status: .planned),
    .init(githubIssueID: "291", title: "Manually select locations waypoints", description: "Create a location Quick Action by collecting lon-lat waypoints manually", status: .planned),
    .init(githubIssueID: "87", title: "tvOS Support", description: "Use RocketSim with the tvOS Simulator", status: .planned),
    .init(githubIssueID: "301", title: "Fullscreen Support", description: "Use RocketSim with Xcode in fullscreen mode", status: .planned),
    .init(githubIssueID: "497", title: "Allow adding items to User Defaults", description: "Add items from within the User Defaults editor", status: .planned),
    .init(githubIssueID: "483", title: "Allow right-click -> Edit on any action", description: "Directly access App Action editor via right-click", status: .planned),
    .init(githubIssueID: "480", title: "Support GPX files for location simulation", description: "Simulate locations using GPX files", status: .planned),
    .init(githubIssueID: "464", title: "Introduce App Action tags for grouping", description: "Group long lists of app actions based on configured tags", status: .planned),
    .init(githubIssueID: "397", title: "Support reachability libraries (NWPathFilter) with Airplane Mode", description: "Simulator Airplane Mode support for NWPathFilter, which is often used in accessibility libraries", status: .planned),
    .init(githubIssueID: "435", title: "Integrate Sketch App to use artboards for design comparison", description: "Select a Sketch artboard and show it on top of the simulator for design comparison", status: .planned),
    .init(githubIssueID: "520", title: "Integrate Figma Connect to use artboards for design comparison", description: "Select a Figma artboard and show it on top of the simulator for design comparison", status: .planned),
    .init(githubIssueID: "521", title: "Accessibility Inspector", description: "Inspect on-screen elements for accessibility. Show a tree of accessibility elements.", status: .planned),
    .init(githubIssueID: "519", title: "Slow Animations Shortcut", description: "Toggle slow animations using a shortcut.", status: .planned),
    .init(githubIssueID: "522", title: "Align rulers to elements", description: "Make rulers sticky to on-screen element boundaries.", status: .planned),
    .init(githubIssueID: "523", title: "Show a score & diff image of the implementation compared to a selected design overlay", description: "A screenshot of the Simulator will be diffed against a selected design overlay, resulting in an implementation score.", status: .planned),
    .init(githubIssueID: "218", title: "Grant/Revoke push notifications permissions", description: "Adding Push notifications permissions to the other existing permission revoke, grant, reset actions.", status: .planned),
    .init(githubIssueID: "374", title: "Grant/Revoke HealthKit permissions", description: "Adding HealthKit permissions to the other existing permission revoke, grant, reset actions.", status: .planned),
    .init(githubIssueID: "561", title: "Reset Kechain action", description: "Allow resetting the keychain without completely resetting the Simulator.", status: .planned),
    .init(githubIssueID: "607", title: "Simulator Camera", description: "Use your Mac's camera as input for the Simulator camera to allow testing camera functionality in the Simulator.", status: .planned),
    .init(githubIssueID: "606", title: "Directory Actions", description: "Create deeplinks for app directories. For example, open .app/caches/db.sqlite with a single click.", status: .planned),
    .init(githubIssueID: "564", title: "Allow copy pasting lat/long values", description: "In addition to specific locations, the option to specify a latitude and longitude.", status: .planned)
]

assert(Set(features.map(\.githubIssueID)).count == features.count, "Duplicate IDs exist!")

let encoder = JSONEncoder()
encoder.outputFormatting = [.sortedKeys, .prettyPrinted]

if let json = try? encoder.encode(features) {
    print(String(data: json, encoding: .utf8)!)
}
