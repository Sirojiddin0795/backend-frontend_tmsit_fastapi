# TMSITI Backend Project

## Overview

This is a FastAPI-based backend application for the Technical Standardization and Research Institute (TMSITI) website. The project provides a comprehensive API for managing institute information, regulations, news, activities, and administrative functions with multi-language support (Uzbek, Russian, English).

## User Preferences

Preferred communication style: Simple, everyday language.
Database preference: SQLite over PostgreSQL for simplicity.
Language preference: Uzbek language support is primary.

## System Architecture

### Backend Framework
- **FastAPI**: Modern, high-performance web framework for building APIs
- **Python 3.11+**: Programming language
- **SQLAlchemy**: ORM for database operations
- **SQLite**: Lightweight database for development and production
- **Pydantic v2**: Data validation and settings management

### Frontend Architecture
- **Modern HTML5/CSS3/JavaScript**: No framework dependencies for simplicity
- **Responsive Design**: Mobile-first approach with CSS Grid and Flexbox
- **Multi-language Support**: JavaScript i18n system with dynamic content loading
- **Component-based Architecture**: Reusable UI components and utilities
- **API Integration**: Direct communication with FastAPI backend

### API Structure
- RESTful API design with versioned endpoints (`/api/v1/`)
- Modular router structure for different functional areas
- JWT-based authentication and authorization
- Role-based access control (Admin, Moderator, User)

### Internationalization
- Multi-language support for Uzbek (uz), Russian (ru), and English (en)
- Backend: Language middleware for automatic detection from headers or query parameters
- Frontend: JavaScript i18n system with embedded translations
- Localized content storage in database models
- JSON-based localization files for system messages
- Real-time language switching without page reload

## Key Components

### Authentication & Authorization
- JWT token-based authentication with access and refresh tokens
- Password hashing using bcrypt
- Role-based permissions (Admin can create moderators, Moderators can manage content)
- Token expiration and refresh mechanism

### Database Models
1. **User Management**: Users with role-based access (admin, moderator, regular)
2. **Content Management**: News and announcements with multi-language support
3. **Regulations**: Laws, standards, urban norms, building regulations
4. **Institute Information**: About section, management, structure, vacancies
5. **Activities**: Management systems certification, laboratory information
6. **Contact**: User inquiries and anti-corruption information

### File Upload System
- Support for images (JPG, PNG, GIF, WebP) and documents (PDF, DOC, DOCX)
- File size validation and type checking
- Organized storage in static directories
- Default image fallback for missing profile pictures

### Search & Pagination
- Full-text search across multiple language fields
- Configurable pagination with default and maximum page sizes
- Language-aware search functionality

## Data Flow

### Request Processing
1. **Language Detection**: Middleware detects language from query params or headers
2. **Authentication**: JWT token validation for protected endpoints
3. **Authorization**: Role-based access control for admin/moderator operations
4. **Request Processing**: Business logic execution with database operations
5. **Response**: Localized responses based on detected language

### Content Management Flow
1. Admin/Moderator creates content with multi-language fields
2. Content stored in database with status flags (active/inactive, featured)
3. Public API serves active content with language-specific fields
4. Search functionality works across all language variants

### File Upload Flow
1. File validation (size, type, format)
2. Unique filename generation to prevent conflicts
3. Storage in organized directory structure
4. Database reference storage for file paths

## External Dependencies

### Backend Dependencies
- **FastAPI**: Web framework and API documentation
- **SQLAlchemy**: Database ORM and migrations
- **Pydantic**: Data validation and serialization
- **python-jose**: JWT token handling
- **passlib**: Password hashing with bcrypt
- **python-multipart**: File upload support
- **Pillow**: Image processing capabilities
- **uvicorn**: ASGI server for development
- **python-dotenv**: Environment variable management

### Frontend Dependencies
- **Font Awesome**: Icon library via CDN
- **No JavaScript frameworks**: Vanilla JS for better performance and maintainability
- **CSS Custom Properties**: For theming and responsive design
- **Modern Browser APIs**: Fetch API, Intersection Observer, Local Storage

### Database
- **SQLite**: Default database with auto-creation of tables
- Database initialization script with admin user setup
- Migration support through SQLAlchemy

### Deployment Files
- **README.md**: Comprehensive documentation with setup instructions
- **Dockerfile**: Container configuration for deployment
- **docker-compose.yml**: Multi-service container orchestration
- **run.py**: Startup script with proper environment configuration
- **requirements_list.txt**: Python dependencies list

## Deployment Strategy

### Configuration Management
- Environment-based configuration using Pydantic Settings
- Support for `.env` files for local development
- Configurable database URLs, security keys, and file upload limits

### Static File Serving
- FastAPI static file mounting for uploaded content
- Organized directory structure for different file types
- Default assets for missing images

### Database Initialization
- Automated table creation script
- Default admin user creation for initial setup
- Development-friendly SQLite with production PostgreSQL migration path

### Production Considerations
- JWT secret key configuration for security
- File upload size limits and security validation
- CORS middleware for frontend integration
- Structured logging and error handling

### API Documentation
- Automatic OpenAPI/Swagger documentation generation
- Organized endpoint grouping by functionality
- Response model documentation for frontend integration

## Recent Changes (January 2025)

### Frontend Implementation Completed
- **Date**: January 10, 2025
- **Changes**: 
  - Created complete frontend application with modern HTML/CSS/JavaScript
  - Implemented responsive design with mobile-first approach
  - Added multi-language support with real-time switching
  - Created API integration layer with error handling and retry logic
  - Implemented component-based architecture for reusable UI elements
  - Added form validation and user feedback systems
  - Integrated frontend with FastAPI backend serving

### Frontend Architecture Details
- **Technology Stack**: Vanilla HTML5, CSS3, JavaScript (ES6+)
- **File Structure**:
  - `frontend/index.html`: Main application entry point
  - `frontend/css/`: Stylesheets with responsive design
  - `frontend/js/`: JavaScript modules (config, API, i18n, components, main)
  - `frontend/images/`: Static assets directory
- **Key Features**:
  - Real-time language switching (Uzbek, Russian, English)
  - Responsive grid layouts for news and management sections
  - Contact form with validation and API submission
  - Loading states and error handling throughout
  - Smooth scrolling navigation and animations
  - Pagination for large datasets
  - Notification system for user feedback