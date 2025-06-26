# Архитектура приложения - Диаграммы

## 1. Архитектура системы (Flowchart)

```mermaid
flowchart TD
    %% Entry Point
    A[App.tsx] --> B[Redux Provider]
    B --> C[SafeAreaProvider]
    C --> D[AppNavigator]
    
    %% Navigation
    D --> E[NavigationContainer]
    E --> F[Stack Navigator]
    F --> G[JobsListScreen]
    F --> H[JobDetailsScreen]
    
    %% Redux Store
    I[Redux Store] --> J[favourites: FavouritesSlice]
    I --> K[jobsApi: RTK Query]
    I --> L[coopleApi: RTK Query]
    
    %% Database
    M[(SQLite Database)] --> N[favourites table]
    
    %% External APIs
    O[Coople API] --> P["GET /list?pageNum=0&pageSize=30"]
    O --> Q["GET /{workAssignmentId}"]
    R[Jobs API] --> S["Mock Jobs Data"]
    
    %% Screen Interactions
    G -->|"useGetJobsListQuery(page)"| L
    G -->|"useSelector(favourites.ids)"| J
    G -->|"dispatch(addFavouriteAsync)"| J
    G -->|"navigation.navigate('JobDetails')"| H
    
    H -->|"useGetJobDetailsQuery(id)"| L
    H -->|"useSelector(favourites.ids)"| J
    H -->|"dispatch(removeFavouriteAsync)"| J
    
    %% Data Flow
    L -->|"API Calls"| O
    K -->|"API Calls"| R
    J -->|"async thunks"| T[FavouritesStorage]
    T -->|"initFavoritesTable()<br/>addFavourite()<br/>removeFavourite()<br/>getAllFavouriteIds()"| M
    
    %% Initialization
    D -->|"useEffect"| U[Initialize Favourites]
    U -->|"initFavoritesTable()"| T
    U -->|"dispatch(loadFavouritesAsync())"| J
    
    %% Deep Linking
    V[Deep Links] -->|"myjobsapp://jobs"| G
    V -->|"myjobsapp://job/:id"| H
    
    %% Styling
    classDef screen fill:#e1f5fe
    classDef redux fill:#f3e5f5
    classDef api fill:#e8f5e8
    classDef database fill:#fff3e0
    classDef navigation fill:#fce4ec
    
    class G,H screen
    class I,J,K,L redux
    class O,R,P,Q,S api
    class M,N,T database
    class D,E,F,V navigation
```

## 2. Пользовательские сценарии (Sequence Diagram)

```mermaid
sequenceDiagram
    participant User
    participant App as App.tsx
    participant Nav as AppNavigator
    participant JobsList as JobsListScreen
    participant JobsDetails as JobDetailsScreen
    participant Store as Redux Store
    participant API as Coople API
    participant DB as SQLite DB
    
    %% App Initialization
    User->>App: Launch App
    App->>Store: Create Redux Store
    App->>Nav: Render AppNavigator
    Nav->>DB: initFavoritesTable()
    Nav->>Store: dispatch loadFavouritesAsync
    Store->>DB: getAllFavouriteIds()
    DB-->>Store: Return favourite IDs
    Nav->>JobsList: Navigate to JobsList
    
    %% Load Jobs List
    JobsList->>Store: useGetJobsListQuery(0)
    Store->>API: GET /list?pageNum=0&pageSize=30
    API-->>Store: Return jobs data
    Store-->>JobsList: Update jobs state
    JobsList->>User: Display job cards
    
    %% Add to Favourites
    User->>JobsList: Tap star on job card
    JobsList->>Store: dispatch addFavouriteAsync
    Store->>DB: addFavourite(jobId)
    DB-->>Store: Confirm saved
    Store-->>JobsList: Update favourites state
    JobsList->>User: Show filled star
    
    %% Navigate to Details
    User->>JobsList: Tap on job card
    JobsList->>JobsDetails: Navigate to JobDetails
    JobsDetails->>Store: useGetJobDetailsQuery(id)
    Store->>API: GET /{workAssignmentId}
    API-->>Store: Return job details
    Store-->>JobsDetails: Update details state
    JobsDetails->>User: Display job details
    
    %% Toggle Favourite in Details
    User->>JobsDetails: Tap favourite button
    JobsDetails->>Store: dispatch removeFavouriteAsync
    Store->>DB: removeFavourite(jobId)
    DB-->>Store: Confirm removed
    Store-->>JobsDetails: Update favourites state
    JobsDetails->>User: Show empty star
    
    %% Load More Jobs
    User->>JobsList: Tap Load More button
    JobsList->>Store: useGetJobsListQuery(1)
    Store->>API: GET /list?pageNum=1&pageSize=30
    API-->>Store: Return more jobs
    Store-->>JobsList: Append to jobs list
    JobsList->>User: Display additional jobs
    
    %% Deep Link Navigation
    User->>Nav: Open deep link job/123
    Nav->>JobsDetails: Navigate with id=123
    JobsDetails->>Store: useGetJobDetailsQuery(123)
    Store->>API: GET /123
    API-->>Store: Return job details
    Store-->>JobsDetails: Update state
    JobsDetails->>User: Display job details
```

## Описание компонентов

### 🎯 Основные экраны:
- **JobsListScreen** - список вакансий с пагинацией и избранным
- **JobDetailsScreen** - детали вакансии с возможностью добавления в избранное

### 🗄️ Управление состоянием:
- **Redux Store** - централизованное хранилище состояния
- **FavouritesSlice** - управление избранными вакансиями
- **RTK Query APIs** - кэширование и управление API запросами

### 💾 Хранение данных:
- **SQLite Database** - локальное хранение избранного
- **Coople API** - внешний источник данных вакансий

### 🔗 Навигация:
- **React Navigation** - маршрутизация между экранами
- **Deep Linking** - прямые ссылки на конкретные вакансии

### 🎨 Цветовая схема:
- 🔵 Экраны (UI компоненты)
- 🟣 Redux (управление состоянием) 
- 🟢 API (внешние данные)
- 🟠 База данных (локальные данные)
- 🔴 Навигация (маршрутизация) 