# Organizzzer App

<p align="center">
  <img src="https://raw.githubusercontent.com/bartekszajna/organizer_app_design/master/design/desktop_views/main_view.jpg" width="60%"/>
</p>

### Client-side code of PHP + MySQL website, which allows you to maintain, manage and keep track of your tasks and other priorities. With [Figma design version](https://github.com/bartekszajna/organizer_app_design) of the app together those repos make up a front-end part of project.

#

<p align="center">
  <img src="https://raw.githubusercontent.com/bartekszajna/organizer_app_design/master/design/desktop_views/profile_view.jpg" width="60%" />
</p>

## Features:

- PHP on server-side, PDO API for database connection
- registration, login features
- server-side session and cookies to keep the user logged in throughout the website
- simple DB for users and their tasks management
- users passwords stored as irreversible hashes
- account data update possibility from the inside
- deleting account possibility
- local&session storage for durable inputs data
- full responsiveness in width range of 280px (Galaxy Fold) to over 2k px
- main data validation on server-side
- client-side JS custom validation to reduce amount of futile requests
- HTML default validation as a fallback of last resort for users with browser-JS disabled(not much of a feature though)
- tasks view with sorting option (requires new http request fo fetching list sorted by db)
- confirmation modal for deleting account
- inspirational quotes at profile page fetched asynchronously from
  [quotable](https://github.com/lukePeavey/quotable)

## Above photographs come from [Unsplash](https://unsplash.com). Credits:

<span>Photo by <a href="https://unsplash.com/@vadimpng?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText">Vadim Fomenok</a> on <a href="https://unsplash.com/?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText">Unsplash</a></span>

<span>Photo by <a href="https://unsplash.com/@alexisrbrown?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText">Alexis Brown</a> on <a href="https://unsplash.com/s/photos/studying-people?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText">Unsplash</a></span>
