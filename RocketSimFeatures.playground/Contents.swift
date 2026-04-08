import Foundation

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
    .init(githubIssueID: "564", title: "Allow copy pasting lat/long values", description: "In addition to specific locations, the option to specify a latitude and longitude.", status: .implemented),
    .init(githubIssueID: "283b", title: "Network Link Conditioner", description: "Apart from Airplane mode, allow to only slow down the network connection for a specific Simulator app w/o influencing your Mac's connection", status: .implemented),
    .init(githubIssueID: "607", title: "Simulator Camera", description: "Use your Mac's camera as input for the Simulator camera to allow testing camera functionality in the Simulator.", status: .implemented),
    .init(githubIssueID: "289", title: "Add a wallpaper and padding to screenshots", description: "Beautify screenshots with a gradient background and extra padding", status: .implemented),
    .init(githubIssueID: "497", title: "Allow adding items to User Defaults", description: "Add items from within the User Defaults editor", status: .implemented),
    .init(githubIssueID: "236", title: "Allow Save as... for captured thumbnails", description: "Right-click a thumbnail to save as...", status: .implemented),
    .init(githubIssueID: "218", title: "Grant/Revoke push notifications permissions", description: "Adding Push notifications permissions to the other existing permission revoke, grant, reset actions.", status: .implemented),
    .init(githubIssueID: "269", title: "High-FPS Recordings (60 & 120 FPS)", description: "Record smoother simulator videos at 60 or 120 FPS.", status: .implemented),
    .init(githubIssueID: "285", title: "Record Mic audio with recordings", description: "Record simulator videos together with system microphone audio.", status: .implemented),
    .init(githubIssueID: "521", title: "Accessibility Inspector", description: "Inspect on-screen accessibility elements and explore their hierarchy directly in RocketSim.", status: .implemented),
    .init(githubIssueID: "561", title: "Reset Keychain", description: "Reset a Simulator app's keychain without fully erasing the Simulator.", status: .implemented),

    /// In Progress
    .init(githubIssueID: "816", title: "RocketSim CLI & Agent Automation", description: "Control RocketSim from the terminal and AI tooling through a stable automation surface.", status: .inProgress),

    /// Planned
    .init(githubIssueID: "370", title: "SwiftData Visual Viewer & Editor", description: "Explore and edit SwiftData databases.", status: .planned),
    .init(githubIssueID: "347", title: "Username/Password Quick Action", description: "Allow to fill in account details inside a email/password textfield via a Quick Action.", status: .planned),
    .init(githubIssueID: "311", title: "Show debugger logs", description: "Show OSLog-based debugger logs next to the simulator with filters for levels like debug, info, and error", status: .planned),
    .init(githubIssueID: "280", title: "Resize screenshots", description: "Allow resizing the output screenshot to reduce size and resolution", status: .planned),
    .init(githubIssueID: "299", title: "Low storage testing", description: "Simulate low storage on the Simulator to trigger No Space Left errors", status: .planned),
    .init(githubIssueID: "301", title: "Fullscreen Support", description: "Use RocketSim with Xcode in fullscreen mode", status: .planned),
    .init(githubIssueID: "480", title: "Support GPX files for location simulation", description: "Simulate locations using GPX files", status: .planned),
    .init(githubIssueID: "435", title: "Integrate Sketch App to use artboards for design comparison", description: "Select a Sketch artboard and show it on top of the simulator for design comparison", status: .planned),
    .init(githubIssueID: "520", title: "Integrate Figma Connect to use artboards for design comparison", description: "Select a Figma artboard and show it on top of the simulator for design comparison", status: .planned),
    .init(githubIssueID: "374", title: "Grant/Revoke HealthKit permissions", description: "Adding HealthKit permissions to the other existing permission revoke, grant, reset actions.", status: .planned),
    .init(githubIssueID: "963", title: "Face ID Testing", description: "Test Face ID and Touch ID flows from RocketSim with quick enroll and authentication actions.", status: .planned),
    .init(githubIssueID: "731", title: "MCP Server", description: "Expose RocketSim features to AI workflows through a Model Context Protocol server.", status: .planned),
    .init(githubIssueID: "543", title: "Simulator TestFlight", description: "Install builds directly into the Simulator using a TestFlight-style workflow.", status: .planned),
    .init(githubIssueID: "544", title: "Show Logs Inside Network Monitor", description: "View logs alongside network requests to understand the full debugging breadcrumb trail.", status: .planned)
]

assert(Set(features.map(\.githubIssueID)).count == features.count, "Duplicate IDs exist!")

let encoder = JSONEncoder()
encoder.outputFormatting = [.sortedKeys, .prettyPrinted]

if let json = try? encoder.encode(features) {
    print(String(data: json, encoding: .utf8)!)
}
