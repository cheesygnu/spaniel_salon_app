# Product Requirements Document (PRD)
## Spaniel Salon App

**Version:** 1.1  
**Date:** 2024  
**Status:** Active Development

---

## 1. Executive Summary

The Spaniel Salon App is a Single Page Application (SPA) built with Angular that manages dog records and appointments for a dog grooming salon. The application provides a comprehensive interface for viewing, adding, and managing dog information stored in Google Firebase, with responsive design that adapts to both desktop and mobile devices.

---

## 2. Technical Requirements

### 2.1 Framework & Architecture
- **Framework:** Angular (latest stable version)
- **Application Type:** Single Page Application (SPA)
- **Change Detection:** Angular Zoneless (experimental) - uses `provideExperimentalZonelessChangeDetection()` with explicit `ChangeDetectorRef.markForCheck()` calls for async operations
- **Routing:** Angular Router with child routes
- **State Management:** Component-based state management
- **Backend:** Google Firebase (Firestore database)

### 2.2 Browser Support
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome Mobile)
- Progressive Web App (PWA) capabilities

### 2.3 Responsive Design
- **Desktop/Web:** Full sidebar navigation with split-pane view
- **Tablet:** Bottom navigation bar with full-page views
- **Handset:** Bottom navigation bar with full-page views
- **Breakpoint Detection:** Angular CDK `BreakpointObserver` using predefined breakpoints:
  - `Breakpoints.Handset`: Mobile phones (max-width: 599px)
  - `Breakpoints.Tablet`: Tablets (600px - 959px)
  - Web: Desktop screens (min-width: 960px)

---

## 3. Core Features

### 3.1 Navigation System

#### 3.1.1 Sidebar Navigation (Desktop)
- **Location:** Left sidebar, persistent across all pages
- **Navigation Items:**
  1. **Home** - Links to `/main/homepage`
     - Icon: `home`
     - Active state indicator
  2. **Dogs** - Links to `/main/dog-directory`
     - Icon: `sound_detection_dog_barking`
     - Active state indicator
  3. **Appointments** - Links to `/main/appointments`
     - Icon: `calendar_clock`
     - Active state indicator
     - Protected route (requires authentication)
  4. **Settings** - Links to `/main/settings`
     - Icon: `settings`
     - Active state indicator

#### 3.1.2 Bottom Navigation (Mobile)
- **Location:** Fixed bottom navigation bar
- **Display:** Icon-based navigation with labels
- **Items:** Same four navigation options as sidebar
- **Behavior:** Replaces sidebar on screens < 1000px width

#### 3.1.3 Status Bar (Optional)
- **Location:** Footer of navigation component
- **Content:** 
  - Application version number
  - User login status
- **Visibility:** Configurable via StatusBarService

---

### 3.2 Dogs Page (`/main/dog-directory`)

#### 3.2.1 Dog List View
- **Layout:** Left panel (desktop/tablet) or full page (handset)
- **Header Section:**
  - Title: "Dogs"
  - **Add New Dog button (circular icon):** Visible on Handset/Tablet only
    - Icon: `dog-barking-plus`
    - Located next to "Dogs" title
- **Search Functionality:**
  - Search input field with search icon
  - Placeholder: "Search dog or owner name"
  - Filters dogs by name or owner name
- **Dog List:**
  - Displays all dogs from Firebase Firestore
  - Ordered alphabetically by dog name
  - Each list item displays:
    - **Dog Photo:** Circular thumbnail image
    - **Dog Name:** Clickable link
    - **Owner Name:** Displayed in brackets next to dog name
      - Format: `DogName (OwnerFirstName OwnerSurname)`
  - Real-time updates via Firestore `onSnapshot` listener
- **Add New Dog button (full-width):** Visible on Web/Desktop only
  - Located at bottom of dog list
  - Text: "Add new dog" with icon

#### 3.2.2 Dog Details View

**Web/Desktop Behavior (Not Handset or Tablet):**
- **Location:** Right panel, displayed alongside dog list
- **Display:** Split-pane layout
- **Trigger:** Clicking a dog name in the list
- **Component:** `DogDetailsComponent` embedded in `DogDirectoryComponent`
- **Data Binding:** Selected dog passed via `@Input() chosenDog`
- **Navigation:** No router navigation, uses component binding

**Handset/Tablet Behavior:**
- **Location:** Full page navigation
- **Route:** `/details/:id` where `:id` is the dog ID
- **Trigger:** Clicking a dog name navigates to new route (via `routerLink`)
- **Component:** `DogDetailsComponent` as standalone page
- **Back Navigation:** Back button returns to dog list

#### 3.2.3 Add New Dog Functionality
- **Trigger Buttons:**
  - **Handset/Tablet:** Circular icon button in header (next to "Dogs" title)
  - **Web/Desktop:** Full-width button at bottom of dog list with text "Add new dog"
- **Handset/Tablet Behavior:**
  - Navigates to `/details/new`
  - Opens full-page edit form
  - Automatically enters edit mode
- **Web/Desktop Behavior:**
  - Sets `selectedDog` to `BLANK_DOG`
  - Sets `editStatus` to `true`
  - Displays blank form in right panel (split-pane view)

---

### 3.3 Dog Details Component

#### 3.3.1 Display Modes
- **View Mode:** Read-only display of dog information
- **Edit Mode:** Editable form for modifying dog details
- **Toggle:** Edit button switches between modes

#### 3.3.2 Dog Information Fields
- **Dog Name:** Required field
  - Validation: Cannot be blank
  - Error message: "Dog name can't be blank"
- **Dog Photo:** Image display/upload capability
- **Owner Information:**
  - Owner First Name: Required field
    - Validation: Cannot be blank
    - Error message: "Owner's first name can't be blank"
  - Owner Surname: Required field
    - Validation: Cannot be blank
    - Error message: "Owner's surname can't be blank"
  - Additional contact details (phone, email)

#### 3.3.3 Actions
- **Edit:** Toggles edit mode on/off
- **Save:** 
  - Validates required fields
  - Creates new dog/owner if `dogid == UNASSIGNED_ID`
  - Updates existing dog/owner if `dogid != UNASSIGNED_ID`
  - Saves to Firebase Firestore
  - Exits edit mode on success
- **Cancel:** 
  - Discards changes
  - Reverts to original dog data
  - Exits edit mode
- **Back (Mobile only):** Returns to previous page

#### 3.3.4 Data Flow
- **Input Properties:**
  - `@Input() chosenDog: Dog` - Selected dog from list
  - `@Input() editStatus: boolean` - Current edit state
- **Internal State:**
  - `displayedDog: Dog` - Working copy (modified until Save)
  - `displayedOwner: DogOwner` - Working copy of owner
  - `chosenDog: Dog` - Original/committed dog data
- **Lifecycle:**
  - `ngOnInit()`: Handles route-based navigation and initialization
  - `ngOnChanges()`: Responds to `chosenDog` input changes

---

### 3.4 Home Page (`/main/homepage`)
- **Route:** `/main/homepage`
- **Purpose:** Landing page after login
- **Content:** To be defined (currently placeholder)

---

### 3.5 Appointments Page (`/main/appointments`)
- **Route:** `/main/appointments`
- **Authentication:** Protected route (requires `authGuard`)
- **Purpose:** Manage dog grooming appointments
- **Status:** Implementation in progress

---

### 3.6 Settings Page (`/main/settings`)
- **Route:** `/main/settings`
- **Purpose:** Application settings and configuration
- **Features:** Theme settings, user preferences

---

## 4. Data Model

### 4.1 Dog Model
```typescript
class Dog {
  dogid: number;           // Unique identifier (-1 for new dogs)
  dogname: string;         // Required
  mappedOwner: number;     // Reference to owner ID
  appointments: Appointment[]; // Array of appointment objects
}
```

### 4.2 Dog Owner Model
```typescript
class DogOwner {
  ownerid: number;         // Unique identifier (-1 for new owners)
  ownerFirstName: string;  // Required
  ownerSurname: string;   // Required
  // Additional contact fields (phone, email)
}
```

### 4.3 Dog and Owner Combined Model
```typescript
class DogAndOwner {
  dogid: number;
  dogname: string;
  mappedOwner: number;
  ownerName: string;      // Computed: "FirstName Surname"
  appointments: Appointment[];
}
```

### 4.4 Firebase Collections
- **Collection: `dogs`**
  - Document fields: `dogid`, `dogname`, `mappedOwner`, `appointments`
  - Indexed by: `dogname` (alphabetical order)
- **Collection: `owners`**
  - Document fields: `ownerid`, `ownerFirstName`, `ownerSurname`, contact details
  - Queried by: `ownerid` for dog-owner relationships

---

## 5. User Stories

### 5.1 Navigation
- **US-1:** As a user, I want to navigate between Home, Dogs, Appointments, and Settings using a sidebar (desktop) or bottom navigation (mobile), so I can access different sections of the app easily.

### 5.2 Dog List
- **US-2:** As a user, I want to see a list of all dogs with their photos and owner names, so I can quickly identify and select a dog.
- **US-3:** As a user, I want to search for dogs by name or owner name, so I can find specific dogs quickly.
- **US-4:** As a user, I want the dog list to update in real-time when dogs are added or modified, so I always see current information.

### 5.3 Dog Details - Desktop
- **US-5:** As a desktop user, I want to see dog details in a right panel when I click a dog, so I can view information without leaving the list view.
- **US-6:** As a desktop user, I want to edit dog details in the same panel, so I can make changes efficiently.

### 5.4 Dog Details - Mobile
- **US-7:** As a mobile user, I want dog details to open in a full page when I click a dog, so I have more screen space to view information.
- **US-8:** As a mobile user, I want a back button to return to the dog list, so I can navigate easily.

### 5.5 Add New Dog
- **US-9:** As a user, I want to add a new dog by clicking an "Add new dog" button, so I can register new clients.
- **US-10:** As a user, I want to enter dog name and owner information when adding a new dog, so all required data is captured.
- **US-11:** As a user, I want validation to prevent saving dogs with blank names or owners, so data integrity is maintained.

### 5.6 Edit Dog
- **US-12:** As a user, I want to edit existing dog information, so I can update records when details change.
- **US-13:** As a user, I want to cancel edits and revert to original data, so I don't accidentally save unwanted changes.

---

## 6. Acceptance Criteria

### 6.1 Navigation
- ✅ Sidebar displays on desktop (≥1000px width)
- ✅ Bottom navigation displays on mobile (<1000px width)
- ✅ Active route is highlighted in navigation
- ✅ All four navigation items are accessible
- ✅ Navigation persists across page changes

### 6.2 Dogs Page
- ✅ Dog list loads from Firebase Firestore
- ✅ Dogs are sorted alphabetically by name
- ✅ Each dog displays photo, name, and owner name
- ✅ Search functionality filters dogs by name or owner
- ✅ Real-time updates reflect changes in database
- ✅ "Add new dog" circular button in header is visible on Handset/Tablet
- ✅ "Add new dog" full-width button at bottom is visible on Web/Desktop
- ✅ Only one "Add new dog" button is visible at a time based on screen size

### 6.3 Dog Details - Web/Desktop
- ✅ Clicking a dog displays details in right panel (split-pane view)
- ✅ Details panel shows all dog and owner information
- ✅ Edit mode can be toggled
- ✅ Changes are saved to Firebase
- ✅ Cancel discards unsaved changes
- ✅ No router navigation, uses component data binding

### 6.4 Dog Details - Handset/Tablet
- ✅ Clicking a dog navigates to `/details/:id` via routerLink
- ✅ Full page displays all dog information
- ✅ Back button returns to dog list
- ✅ Edit functionality works on mobile/tablet
- ✅ Dog details panel is hidden (not displayed)

### 6.5 Add New Dog
- ✅ "Add new dog" opens blank form
- ✅ Form validates required fields (dog name, owner first name, owner surname)
- ✅ New dog is saved to Firebase with unique ID
- ✅ New owner is created if owner ID is unassigned
- ✅ Dog list updates after adding new dog

### 6.6 Data Validation
- ✅ Dog name cannot be blank
- ✅ Owner first name cannot be blank
- ✅ Owner surname cannot be blank
- ✅ Error messages display for invalid fields
- ✅ Save is disabled when validation fails

### 6.7 Firebase Integration
- ✅ Dogs are stored in `dogs` collection
- ✅ Owners are stored in `owners` collection
- ✅ Dog-owner relationships via `mappedOwner` field
- ✅ Real-time listeners update UI automatically
- ✅ Create, read, update operations work correctly

---

## 7. Technical Implementation Details

### 7.1 Routing Structure
```
/login                          → LoginComponent
/main                           → MyMainComponent (wrapper)
  /main/homepage                → HomepageComponent
  /main/dog-directory           → DogDirectoryComponent
  /main/appointments            → AppointmentsComponent (protected)
  /main/settings                → SettingsComponent
/details/:id                    → DogDetailsComponent (standalone)
  /details/new                  → DogDetailsComponent (new dog)
```

### 7.2 Component Hierarchy
```
AppComponent
└── MyMainComponent
    ├── NavigationComponent (sidebar/bottom nav)
    └── RouterOutlet
        ├── HomepageComponent
        ├── DogDirectoryComponent
        │   └── DogDetailsComponent (embedded, desktop)
        ├── AppointmentsComponent
        └── SettingsComponent
```

### 7.3 Services
- **DogCreatorService:** Handles CRUD operations for dogs and owners
- **AuthService:** Manages user authentication
- **ThemeService:** Manages UI theme (dark/light mode)
- **StatusBarService:** Controls status bar visibility
- **BreakpointObserver (Angular CDK):** Detects screen size breakpoints (Handset, Tablet, Web)

### 7.3.1 Change Detection Strategy
- **Zoneless Mode:** Application uses Angular's experimental zoneless change detection
- **Implementation:** Components explicitly call `ChangeDetectorRef.markForCheck()` after:
  - Firebase callbacks (`onSnapshot`, `onAuthStateChanged`)
  - Async/await operations that update component state
  - RxJS subscriptions that modify component properties
  - Window event listeners that update state
  - Router navigation events that change component state
- **Benefits:** Reduced bundle size, improved performance, more predictable change detection
- **Trade-offs:** Requires explicit change detection triggers, more manual code maintenance

### 7.4 Constants
- `UNASSIGNED_ID = -1`: Identifier for new/unsaved records
- `ERROR_ID = -999`: Error state identifier
- **Breakpoints:** Angular CDK predefined breakpoints:
  - `Breakpoints.Handset`: Mobile phones (max-width: 599px)
  - `Breakpoints.Tablet`: Tablets (600px - 959px)
  - Web: Desktop screens (min-width: 960px)

---

## 8. Future Enhancements

### 8.1 Planned Features
- Complete Appointments page implementation
- Photo upload functionality for dogs
- Advanced search and filtering
- Appointment scheduling from dog details
- Owner management page
- Export/import functionality
- Offline support with service workers

### 8.2 Technical Improvements
- Implement state management (NgRx or similar)
- Add unit and integration tests
- Improve error handling and user feedback
- Optimize Firebase queries and indexes
- Add loading states and skeletons
- Implement pagination for large dog lists

---

## 9. Dependencies

### 9.1 Core Dependencies
- Angular Framework (with Zoneless change detection)
- Angular Router
- Firebase SDK (direct integration, not Angular Fire)
- Angular Material Icons
- Angular CDK (for BreakpointObserver)

### 9.2 Firebase Services
- Firestore Database
- Firebase Authentication
- Firebase Storage (for photos)

---

## 10. Glossary

- **SPA (Single Page Application):** Web application that loads a single HTML page and dynamically updates content
- **Firestore:** NoSQL document database by Google Firebase
- **Route Parameter:** Dynamic segment in URL (e.g., `:id` in `/details/:id`)
- **Child Route:** Nested route within a parent route component
- **Auth Guard:** Route protection mechanism requiring authentication
- **Real-time Listener:** Firestore `onSnapshot` that updates when data changes
- **Zoneless Change Detection:** Angular's experimental change detection mode that doesn't use Zone.js, requiring explicit `ChangeDetectorRef.markForCheck()` calls after async operations
- **ChangeDetectorRef:** Angular service that allows components to manually trigger change detection when using zoneless mode

---

## 11. Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.1 | 2024 | Development Team | Migrated to Angular Zoneless change detection |
| 1.0 | 2024 | Development Team | Initial PRD creation |

---

**Document Owner:** Development Team  
**Last Updated:** 2024  
**Next Review:** As needed
