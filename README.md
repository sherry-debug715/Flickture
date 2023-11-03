<h1>Welcome to <span style="color:rgb(1,98,220)">F</span><span style="color:rgb(255,0,132)">l</span ><span style="color:rgb(163,163,163)">ickture</span></h1> 
<img src="https://cdn.discordapp.com/attachments/900530365754638400/1149803547035189340/image.png" />

### Live link: [Flickture](https://flickture.onrender.com/)

### About The Project
__Flickture__ is a dynamic single-page application inspired by Pinterest, where users can find and search for inspiration and ideas on a variety of topics. It functions as a digital pinboard, allowing users to create, and manage their pins and boards, follow or unfollow their friends, and bookmark favorite pins.

### Built With
<div style="display:flex; justify-content:space-between">
    <div style="display:flex; flex-direction:column; align-items: center">
        <h4>Backend</h4>
        <ul>
            <li>
                <img 
                src="https://cdn.discordapp.com/attachments/900530365754638400/1149791459793444984/image.png"
                style="height:25px; width: 60px"
                >
            </li>
            <li>
                <img 
                src="https://media.discordapp.net/attachments/900530365754638400/1149792847168544888/image.png?width=878&height=432"
                style="height:25px; width: 60px"
                >
            </li>
            <li>
                <img 
                src="https://cdn.discordapp.com/attachments/900530365754638400/1149795287670472754/image.png"
                style="height:25px; width: 60px"
                >
            </li>
            <li>
                <img 
                src="https://cdn.discordapp.com/attachments/900530365754638400/1149795726474367016/image.png"
                style="height:25px; width: 60px"
                >
            </li>
            <li>
                <img 
                src="https://cdn.discordapp.com/attachments/900530365754638400/1149797054227423273/image.png"
                style="height:30px; width: 60px"
                >
            </li>
        </ul>
    </div>
    <div style="display:flex; flex-direction:column; align-items: center">
        <h4>Frontend</h4>
        <ul>
            <li>
                <img 
                src="https://cdn.discordapp.com/attachments/900530365754638400/1149796577335070740/image.png"
                style="height:25px; width: 60px"
                >
            </li>
            <li>
                <img 
                src="https://cdn.discordapp.com/attachments/900530365754638400/1149796739092582400/image.png"
                style="height:25px; width: 60px"
                >
            </li>
            <li>
                <img 
                src="https://cdn.discordapp.com/attachments/900530365754638400/1149797556247871538/image.png"
                style="height:25px; width: 60px"
                >
            </li>
            <li>
                <img 
                src="https://cdn.discordapp.com/attachments/900530365754638400/1149798035895889920/image.png"
                style="height:25px; width: 60px"
                >
            </li>
            <li>
                <img 
                src="https://cdn.discordapp.com/attachments/900530365754638400/1149798867248885800/image.png"
                style="height:60px; width: 60px"
                >
            </li>
        </ul>
    </div>
    <div style="display:flex; flex-direction:column; align-items: center">
        <h4>Deployment</h4>
        <ul>   
            <li>
                <img 
                src="https://cdn.discordapp.com/attachments/900530365754638400/1149799531752468560/image.png"
                style="height:25px; width: 60px"
                >
            </li>   
        </ul>
    </div>
</div>

---
## Getting Started
1. Clone this repository (only the main branch)
- Use SSH key:
```
git clone git@github.com:sherry-debug715/Flickture.git
```
- Using web URL:
```
git clone https://github.com/sherry-debug715/Flickture.git
```

2. **Open the repo in VS Code** or other **code editors** of your preference.
 

3. Create a .env file based on the example with proper settings for your development environment.

4. Install dependencies:
```
pipenv install --dev -r dev-requirements.txt && pipenv install -r requirements.txt
```
5. Set up Database
- Get into pipenv, migrate your database, seed your database, and run your flask app.
```
pipenv shell
```
```
flask db upgrade
```
```
flask seed all
```
```
flask run
```
6. To run the React App, install the dependencies in the react-app folder and run the application.
```
npm install
```
```
npm start
```
7. The application will start at http://localhost:3000/.

## Demo

#### Login Modal

<img 
    src="https://cdn.discordapp.com/attachments/900530365754638400/1169719362517749800/image.png" 
/>

#### Sign up Modal 

<img src="https://cdn.discordapp.com/attachments/900530365754638400/1169721332070625430/image.png"
/>

#### Home Page 
![home page-2](https://github.com/sherry-debug715/Flickture/assets/67481206/1734c79c-ca14-4179-ad39-3ca8f3e8d57f)

Regardless of your authentication status, you can explore the entire collection of pin feeds via infinite scrolling.

#### Pin Detail Page 
![single pin page](https://github.com/sherry-debug715/Flickture/assets/67481206/a7931e30-6bb0-462f-848b-e82f37a6c5c1)

Hovering over an image reveals the creator's name and the count of comments on the pin. Clicking on the pin opens a detailed view, presenting the creator’s profile, a description of the image, user-generated comments, and a selection of related images organized by category.

#### Create pin, a new board then add the pin to board
![create pin and board](https://github.com/sherry-debug715/Flickture/assets/67481206/f417f3fc-87b1-436f-a788-96b43502a7d9)

You can create new pins and adding them to your personalized boards, whether they are existing collections or new ones you create.


#### Edit and Delete Pin
![edit and delete pin](https://github.com/sherry-debug715/Flickture/assets/67481206/e6b6d8b9-f273-47fa-bd37-c0d8c244f86d)

The dynamic profile feature enables the modification or removal of any of your pins from various locations.

#### Boards
![boards](https://github.com/sherry-debug715/Flickture/assets/67481206/dd658e2d-70ad-448d-af9f-180ff2ab20c3)

Save your pins to boards. Create fresh boards directly from your profile or while saving/creating a particular pin. Tailor your boards to your preferences by editing them anytime and easily shuffle pins between boards. Plus, you have the flexibility to delete any board that you no longer need.

#### Follow
![follow](https://github.com/sherry-debug715/Flickture/assets/67481206/bd8020af-146e-45a3-b950-392a5c43d512)

Connect with others by following and gaining followers, see who you're following and who follows you. 

#### Favorite 
![favorite](https://github.com/sherry-debug715/Flickture/assets/67481206/2c9b2472-7693-46b2-a03c-597887d77358)

Like pins to save your favorites and categorize them on various boards.

#### Comments
![comments-1](https://github.com/sherry-debug715/Flickture/assets/67481206/366fbcf2-b80e-409d-ad04-1ee1e7a8423f)

Post your thoughts, feedback, or questions to engage with pins and foster a community-driven conversation around shared interests.

#### Profile Manage
![profiles](https://github.com/sherry-debug715/Flickture/assets/67481206/8eea4cfb-b6ba-4476-8611-657240f31e75)









