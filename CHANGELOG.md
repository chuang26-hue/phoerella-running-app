# Changelog

All notable changes to this project will be documented in this file.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/).

## [0.4.0] - 2025-12-07

### Added
#### Social Features (Student B)
- Implemented follow/unfollow functionality allowing users to connect with other runners
- Added search bar with filtering logic to discover profiles 
- Introduced runner tagging system to tag other users in runs

#### Functionality Features (Student A)
- Implemented infinite scroll on Home page to see run activities from profiles user follows
- Added reset/forget password 
- Syled Home and rest of website with tailwindCSS

### Fixed
- Implemented Parse Collections caching pattern for profiles and runs, significantly reducing page load times and Back4App queries
- Fixed follower count not updating after follow/unfollow actions by implementing useEffect-based refresh pattern
- Reorganized website structure with updated footer

## [0.3.1] - 2025-11-07
### Added
- ProtectedAuthRoute component to prevent logged-in users from accessing auth pages
- Automatic redirect to user profile page after login and registration

### Fixed
- Authentication session persistence after user signup
- Profile creation permission handling
- Registration redirect flow
- Double alert issue on auth pages

## [0.3.0] - 2025-11-06
### Added
- Implemented user authentication feature (login, log out, register, path protection).
- Released version 0.3.0 on GitHub.

## [0.2.0] - 2025-10-16
### Added
- Initial changelog created.
- Released version 0.2.0.
- Feature 4 released. 
