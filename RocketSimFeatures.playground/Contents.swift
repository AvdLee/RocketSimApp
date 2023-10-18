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
    .init(githubIssueID: "135", title: "Apple Watch Support", description: "Use RocketSim with the Apple Watch Simulator", status: .implemented),
    .init(githubIssueID: "87", title: "tvOS Support", description: "Use RocketSim with the tvOS Simulator", status: .planned),
    .init(githubIssueID: "263", title: "Magnifier Color Picker", description: "Select a color using the Magnifier", status: .implemented),
    .init(githubIssueID: "282", title: "Allow to search Quick Actions", description: "Filter long lists by searching for a query", status: .planned),
    .init(githubIssueID: "291", title: "Manually select locations waypoints", description: "Create a location Quick Action by collecting lon-lat waypoints manually", status: .planned),
    .init(githubIssueID: "278", title: "Show distance between rulers", description: "Measure the distance between rulers", status: .implemented),
    .init(githubIssueID: "236", title: "Allow Save as... for captured thumbnails", description: "Right-click a thumbnail to save as...", status: .planned),
    .init(githubIssueID: "285", title: "Record Mic audio with recordings", description: "Screen recordings with your voice as instructions", status: .planned),
    .init(githubIssueID: "299", title: "Low storage testing", description: "Simulate low storage on the Simulator to trigger No Space Left errors", status: .planned),
    .init(githubIssueID: "283", title: "Simulator Airplane Mode", description: "Disable network connection for a specific Simulator app w/o influencing your Mac's connection", status: .implemented),
    .init(githubIssueID: "289", title: "Add a wallpaper and padding to screenshots", description: "Beautify screenshots with a gradient background and extra padding", status: .planned),
    .init(githubIssueID: "280", title: "Resize screenshots", description: "Allow resizing the output screenshot to reduce size and resolution", status: .planned),
    .init(githubIssueID: "269", title: "120hz Simulator Recording", description: "An alternative recording solution that drastically improves the recordings. Bezels can't be turned off.", status: .planned),
    .init(githubIssueID: "193", title: "Configurable Video Output", description: "Export to .MOV instead of .MP4", status: .planned),
    .init(githubIssueID: "179", title: "Display HTTP Traffic", description: "Show HTTP Traffic directly next to the Simulator", status: .planned),
    .init(githubIssueID: "173", title: "Configurable status bar", description: "Change the status bar of the Simulator", status: .planned),
    .init(githubIssueID: "165", title: "Dynamic Type Control", description: "Adjust Dynamic Type from the side window", status: .implemented),
    .init(githubIssueID: "125", title: "Constant visible touch indicator", description: "Always show a mouse-following touch indicator during recordings", status: .implemented),
    .init(githubIssueID: "284", title: "Show comparison overlay when focus is lost", description: "Keep the comparison overlay visible when switching to apps like Figma or Sketch", status: .implemented),
    .init(githubIssueID: "311", title: "Show debugger logs", description: "Show OSLog-based debugger logs next to the simulator with filters for levels like debug, info, and error", status: .planned),
    .init(githubIssueID: "286", title: "Locale switcher", description: "Quickly relaunch your app in a different locale w/o the need to restart the Simulator.", status: .implemented),
    .init(githubIssueID: "345", title: "User Defaults Actions", description: "Add custom bundle identifier-based actions that modify user defaults for your application. Possible replacement to in-app debug views.", status: .planned),
    .init(githubIssueID: "283b", title: "Network Link Conditioner", description: "Apart from Airplane mode, allow to only slow down the network connection for a specific Simulator app w/o influencing your Mac's connection", status: .planned),
    .init(githubIssueID: "346", title: "Dark Mode switcher", description: "Allow to switch between dark/light mode from the side window.", status: .implemented),
    .init(githubIssueID: "347", title: "Username/Password Quick Action", description: "Allow to fill in account details inside a email/password textfield via a Quick Action.", status: .planned),
    .init(githubIssueID: "370", title: "SwiftData Visual Viewer & Editor", description: "Explore and edit SwiftData databases.", status: .planned),
    .init(githubIssueID: "371", title: "UserDefaults Visual Viewer & Editor", description: "Directly edit and view UserDefaults.", status: .implemented),
    .init(githubIssueID: "368", title: "Show Magnifier boundaries", description: "Show a square around the zoomed section on top of the Simulator screen for easier coordination", status: .planned),
    .init(githubIssueID: "357", title: "Clipboard copy to/from buttons", description: "Sync the clipboard between your Mac and the Simulator by using copy from/to buttons", status: .planned),
    .init(githubIssueID: "353", title: "Automatically update timezone to match location change", description: "Restarts your app with the requested location and updates the timezone for your app accordingly", status: .implemented),
    .init(githubIssueID: "304", title: "Xcode Build Statistics", description: "Get statistics on number of builds, build times, and more. Beautifully graphs to keep track of your projects.", status: .planned)
]

assert(Set(features.map(\.githubIssueID)).count == features.count, "Duplicate IDs exist!")

let encoder = JSONEncoder()
encoder.outputFormatting = .prettyPrinted

if let json = try? encoder.encode(features) {
    print(String(data: json, encoding: .utf8)!)
}
