# chillax_frontend

Front end repository of the project. To see the Back end written in rails please check out this repository:
https://github.com/EdPutans/chillax-backend

Wonder where to go for this holiday? Not sure whether if the weather is typically good this time around? What about the budget?
If these questions give you a headache, then this app is for you to try!

This is a Single Page App designed for the user to be able to select a potential travel destination based on the month they have their annual leave. The app suggests a total of 29 destinations, the user can dynamically filter them by month or budget and upon selecting the destination, they will see a pop-out with pictures, destination info and the ability to read and leave a comment.
Prices are shown for couples and are a reference to our highly precise overengineered "How-much-money-do-I-need-in-that-place-to-have-a-good-time" meter.
Users are aso able to add destinations to their favourites list for their future reference (ATM you can add the same destination multiple times)

The app takes data from a manually seeded JSON file run via Rails (see back-end repo) and renders the page appropriately.
User can leave comments in the comment form. Comments are rendered asynchronously.
The login forms verify for string presense only.
Comment form verifies comment length between 2 and 100 characters long.
App requires the backend db to be running as the page is cleared each time the page is refreshed (comments and favourites remain).
