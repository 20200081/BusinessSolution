# Trinidad Field Management System

## Overview

This is a web-based field management system for Trinidad, designed to help managers and technicians coordinate operations across four distinct regions (West, East, Central, and South). The application provides interactive mapping capabilities for each region, user management, and real-time status tracking for field technicians.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
The application follows a multi-page architecture with separate HTML files for each functional area:

- **Login System**: Role-based authentication with separate flows for managers and technicians
- **Manager Interface**: Full access to all regions, user configuration, and administrative functions
- **Technician Interface**: Simplified status card with location assignment and status updates
- **Regional Maps**: Dedicated pages for each of Trinidad's four regions with interactive Leaflet.js maps

### Navigation Structure
The system uses a consistent navigation bar across all manager pages with:
- Home dashboard with regional overview
- Location dropdown for accessing individual region maps
- User configuration for managing technician accounts
- Logout functionality

### Interactive Mapping System
Each region (West, East, Central, South) has its own dedicated map implementation:
- **Leaflet.js Integration**: Interactive maps with custom zoom levels and boundaries for each region
- **Dual-Click Functionality**: Single click adds blue markers, double click adds red markers
- **Draggable Markers**: All markers can be repositioned after placement
- **Region-Specific Bounds**: Each map is constrained to its specific geographical area of Trinidad

### State Management
- **Browser LocalStorage**: Used for persisting technician status and location assignments
- **Cross-Tab Communication**: Storage events enable real-time updates across browser tabs
- **Session Persistence**: User preferences and assignments maintained across page refreshes

### User Role System
Two distinct user roles with different capabilities:
- **Managers**: Full system access, can view all regions, manage users, and assign locations
- **Technicians**: Limited to status updates and viewing assigned locations

### Technician Assignment System
Each region has 4 assigned technicians with unique localStorage keys:
- **West Region**: Rajesh Maharaj, Keisha Mohammed, Anil Persad, Shania Williams
- **East Region**: Ravi Ramsingh, Priya Dookie, Kevin Boodoo, Alicia Singh  
- **Central Region**: Darren Ramjit, Kavita Patel, Marcus Baptiste, Sunita Ramnarine
- **South Region**: Adesh Moonsammy, Kamala Seepersad, Joel Gonzales, Reshma Ramdass

### UI/UX Design Patterns
- **Consistent Styling**: Shared CSS framework across all pages with Trinidad-themed branding
- **Responsive Design**: Mobile-friendly layouts with proper viewport configuration
- **Glass Morphism**: Modern UI effects with backdrop blur and transparency
- **Regional Color Coding**: Visual distinction between different geographical areas

## External Dependencies

### Mapping Services
- **Leaflet.js**: Primary mapping library for interactive map functionality
- **OpenStreetMap**: Tile layer provider for map data
- **Google Maps Icons**: Marker icons for blue and red location indicators

### Frontend Libraries
- **CSS Reset**: Custom reset stylesheet for cross-browser consistency
- **Font Systems**: Segoe UI font stack for modern typography

### Static Assets
- **Trinidad Map Image**: Background image for regional overview dashboard
- **Avatar Images**: User profile pictures stored in Pictures/ directory
- **Regional Reference Images**: Static map images for technician interface

### Browser APIs
- **LocalStorage API**: For client-side data persistence
- **Storage Events**: For cross-tab communication and real-time updates
- **Geolocation API**: Potential integration for location-based features