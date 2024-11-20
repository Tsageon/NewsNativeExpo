1. *Overview*
This app fetches news articles based on selected categories (Bitcoin, Technology, Sports, Business, Health) from the NewsAPI and displays them in a user-friendly interface. Users can bookmark articles for later reference. The app allows users to switch between categories and view updated articles accordingly. Bookmarked articles are saved locally using AsyncStorage for offline access.

2. *How to Use*

*Category Selection:*
At the top of the app, a dropdown (Picker) allows users to select a news category.
Available categories include Bitcoin, Technology, Sports, Business, and Health.
Once a category is selected, the app fetches news articles related to that category.
Viewing Articles:

Articles are displayed in a scrollable list, with each article showing the title, description, publication date, and an image (if available).
Each article is clickable, opening the full article in a browser via the article’s URL.

*Bookmarking Articles:*

Articles can be bookmarked by pressing the "Bookmark" button. Bookmarked articles are stored locally on the device and can be accessed later.
Users can toggle bookmarks (add or remove) by pressing the button again.

*Offline Bookmarks:*

Bookmarked articles are saved locally using AsyncStorage. Even if the app is closed, users can retrieve their bookmarked articles when they return to the app.

*API Integration*
API Used: NewsAPI
Base URL: https://newsapi.org/v2/everything
API Key: a3919a8d92694b498d225157c9bc7f19
Endpoints
Fetching News Articles:

Endpoint: https://newsapi.org/v2/everything?q={category}&apiKey={API_KEY}
Method: GET
Description: Fetches news articles related to a selected category (e.g., "bitcoin", "sports", etc.).
Parameters:

q: The search query (e.g., category like bitcoin, technology, etc.)
apiKey: Your personal API key.
Example URL:
https://newsapi.org/v2/everything?q=bitcoin&apiKey=a3919a8d92694b498d225157c9bc7f19

*Error Handling*
If the fetch request fails (e.g., due to network issues), the app logs the error to the console and displays no articles.
Articles with duplicate URLs are filtered out to ensure that only unique articles are displayed.

*Features*
Category-based Filtering: Select a category to view related articles.
Bookmarking: Save articles for later by bookmarking them. Bookmarks are stored in local storage.
Loading Indicator: While articles are being fetched, a loading spinner is shown.
Display Article Details: Each article shows its title, description, published date, and image (if available).

*Code Summary*
The app is a React Native application that uses a class component.
The Picker component is used to select categories. Once a category is selected, the app fetches news articles using the NewsAPI.
Each article is displayed in a Card component with its title, description, and image.
Articles can be bookmarked, and the state of bookmarked articles is saved to AsyncStorage.
How to Run the App
Clone the repository or download the project files.

*Install dependencies:*
bash

npm install
Make sure you have an API key for NewsAPI. Replace the placeholder API key in the code with your own.

*Run the app:*
bash

npx react-native run-android   
npx react-native run-ios     

*Documentation:*
https://newsapi.org/docs