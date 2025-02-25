--User Account Table

CREATE TABLE Users (
    user_id SERIAL PRIMARY KEY,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)

-- User Account Preferences Table
CREATE Table UserPreferences (
    preference_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES Users(user_id) ON DELETE CASCADE,
    use_accessible_routes BOOLEAN DEFAULT FALSE,
    screen_reader BOOLEAN DEFAULT FALSE,
    high_contrast_mode BOOLEAN DEFAULT FALSE,
    show_elevators BOOLEAN DEFAULT FALSE,
    height_ft DECIMAL(5,2),
    height_in DECIMAL(5,2),
    weight_lbs DECIMAL(5,2),
    prioritize_long_routes BOOLEAN DEFAULT FALSE,
    show_steps_and_calories BOOLEAN DEFAULT FALSE
)

-- Locations Table
CREATE TABLE Locations (
    location_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    address VARCHAR(255) NOT NULL,
    latitude DECIMAL(10,8) NOT NULL,
    longitude DECIMAL(11,8) NOT NULL,
    category VARCHAR(50)
);

--Location Entrances
CREATE TABLE LocationEntrances (
    entrance_id SERIAL PRIMARY KEY,
    location_id INTEGER REFERENCES Locations(location_id) ON DELETE CASCADE,
    entrance_name VARCHAR(100),
    latitude DECIMAL(10,8) NOT NULL,
    longitude DECIMAL(11,8) NOT NULL,
    is_wheelchair_accessible BOOLEAN DEFAULT FALSE,
    has_ramp BOOLEAN DEFAULT FALSE,
    has_elevator BOOLEAN DEFAULT FALSE,
    notes TEXT 
);


-- Accessibility Features Table (Should this be replaced by location entrances^^^?)
CREATE TABLE AccessibilityFeatures (
    feature_id SERIAL PRIMARY KEY,
    location_id INTEGER REFERENCES Locations(location_id),
    wheelchair_accessible BOOLEAN DEFAULT FALSE,
    elevator_available BOOLEAN DEFAULT FALSE,
    ramp_available BOOLEAN DEFAULT FALSE, 
    braille_signage BOOLEAN DEFAULT FALSE, 
    audio_guides BOOLEAN DEFAULT FALSE, 
    sign_language_support BOOLEAN DEFAULT FALSE,
    parking_available BOOLEAN DEFAULT FALSE, 
    accessible_parking_spots INTEGER DEFAULT 0
);

-- User Reviews Table
CREATE TABLE UserReviews (
    review_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES Users(user_id),
    location_id INTEGER REFERENCES Locations(location_id),
    accessibility_rating INTEGER CHECK (accessibility_rating BETWEEN 1 AND 5),
    review_text TEXT,
    review_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Routes Table
CREATE TABLE Routes (
    route_id SERIAL PRIMARY KEY,
    start_location_id INTEGER REFERENCES Locations(location_id),
    end_location_id INTEGER REFERENCES Locations(location_id),
    total_distance DECIMAL(10,2),
    estimated_time INTEGER,
    accessibility_score DECIMAL(4,2)
);

-- Store Saved Routes (Or is that the above table)
CREATE TABLE SavedRoutes (
    saved_route_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES Users(user_id) ON DELETE CASCADE,
    start_location_id INTEGER REFERENCES Locations(location_id) ON DELETE CASCADE,
    end_location_id INTEGER REFERENCES Locations(location_id) ON DELETE CASCADE,
    total_distance DECIMAL(10,2) NOT NULL,
    estimated_time INTEGER NOT NULL,
    date_saved TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User Metrics and Calculations
CREATE TABLE UserRouteMetrics (
    metric_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES Users(user_id) ON DELETE CASCADE,
    route_id INTEGER REFERENCES Routes(route_id) ON DELETE CASCADE,
    height_in DECIMAL(5,2) NOT NULL,
    weight_lbs DECIMAL(5,2) NOT NULL,
    estimated_steps INTEGER NOT NULL, 
    estimated_calories DECIMAL(10,2) NOT NULL 
    
)

-- Route Accessibility Details (review table and determine if needed)
CREATE TABLE RouteAccessibilityDetails (
    route_detail_id SERIAL PRIMARY KEY,
    route_id INTEGER REFERENCES Routes(route_id),
    obstacle_type VARCHAR(100),
    obstacle_description TEXT,
    difficulty_level INTEGER CHECK (difficulty_level BETWEEN 1 AND 5)
);
