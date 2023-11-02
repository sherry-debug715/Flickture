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

![explore_page_infinite_scroll_AdobeExpress](https://github.com/sherry-debug715/Flickture/assets/67481206/4fc24978-f95f-450b-98bb-b0a11970e0da)
![home page](https://github.com/sherry-debug715/Flickture/assets/67481206/0aaa70ff-5024-4b2c-8131-0ffbc0f1e1e7)
