/**
 * @name ServersMenuExtender
 * @author i3sN
 * @authorId 278543574059057154
 * @description Open your servers panel.
 * @version 1.0.3
 * @website https://github.com/VitaliyMubarakov
 * @source https://github.com/VitaliyMubarakov/Menu/
 * @donate https://bfkh.ru/
 */
module.exports = class MyPlugin {
  constructor(meta) {

  }
  
  start() {
    let lang = document.documentElement.lang.substring(0,2);
    //console.log(lang);
    //НЕ СМОТРИТЕ СЮДА! Я уже сам не понимаю смысл текста ниже...
    let body = document.getElementsByTagName("html")[0];
    let discordMenu = document.createElement("div");
    discordMenu.id = "discordMenu";
    body.prepend(discordMenu);

    let servers = [];
    let serversElements = [];
    let serversElementsInGroups = [];
    let allServersElements = Array.from(document.getElementsByClassName("listItem-3SmSlK"));
    serversElements = allServersElements.filter(e => e.parentElement?.nextSibling?.className == "tutorialContainer-2jwoiB");

    var scroller = document.getElementsByClassName("scroller-3X7KbA none-2-_0dP scrollerBase-_bVAAt")[0];
    var folders = document.getElementsByClassName("expandedFolderBackground-1kSAf6");
    var foldersElements = [];
    var scrollerda = document.getElementsByClassName("wrapper-1_HaEi guilds-2JjMmN")[0];

    var separatorWrapper = Array.from(document.getElementsByClassName("listItem-3SmSlK")).find(e => e.firstChild.className == "guildSeparator-a4uisj");
    var items = () => document.getElementsByClassName("listItem-3SmSlK");
  
    let bar = document.createElement("div");
    let isSearch = false;
    let search = document.createElement("div");
    search.className = "searchBar";

    const Type = { msg: -1, ls: 0, server: 1, group: {index: 2, isopen: false}, addServer: 3, servers: 4 };

    scroller.querySelectorAll('[aria-label]');
    let all = [];
    let menuIsOpen = () => {
      return (scrollerda.style.width == "300px");
    }; 

    updateSearchServers();

    var mutationObserver = new MutationObserver(function(mutations) {

      for (let i = 0; i < mutations.length; i++) {
        const m = mutations[i];
        if (!m) continue;
        if (!m?.addedNodes[0]) continue;

        if (!m?.addedNodes[0].parentElement) continue;
        if (!m?.addedNodes[0].children) continue;
        if (!m?.addedNodes[0].children[0]) continue;

        let className = m?.addedNodes[0].children[0].parentElement.children[0].classList[0];
        if (className && className == "listItem-3SmSlK") {
          AddServerBlocks(m?.addedNodes[0].children[0].parentElement.children);
          continue;
        }
        if (m?.addedNodes[0].children[0].parentElement.children[0].className == "listItem-3SmSlK") {
          // console.log("ЛС --------------");
          AddServerBlocks(m?.addedNodes[0].children[0].parentElement.children);
          continue;
        }
        if (m?.addedNodes[0].children[0].parentElement.className == "wrapper-3kah-n") {
          // console.log("блок переместили --------------");
          AddServerBlocks(m?.addedNodes[0].children[0].parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.children);
          continue;
        }
        if (m?.addedNodes[0].children[0].parentElement.className == "listItem-3SmSlK") {
          // console.log("блок положили --------------");
          updateServers();
          AddServerBlock(m?.addedNodes[0].children[0].parentElement, 0, -1);
          continue;
        }
        if (!m?.addedNodes[0].children[0].parentElement.id.includes("folder-items")) continue;
          // console.log("Папку изменили --------------");
          AddServerBlocks(m?.addedNodes[0].children[0].parentElement.children);
      }
    });

    mutationObserver.observe(scroller, {
      attributes: false,
      characterData: true,
      childList: true,
      subtree: true,
      attributeOldValue: false,
      characterDataOldValue: true
    });

    bar.innerHTML = `
    <div id="bar" style="width: 48px; height: 48px; padding-left: 13px;">
        <div>
          <div class="ownButton"></div>

          <svg class="homeIcon-r0w4ny" aria-hidden="true" role="img" width="28" height="20" viewBox="0 0 28 20" style="transform: translate(50%, 60%); pointer-events: none;">
          <path d="M1.06567 1.44049H15.7323" stroke="#DCDDDE" stroke-width="2" stroke-linecap="square" stroke-linejoin="round"/>
          <path d="M1.06567 6.94049H15.7323" stroke="#DCDDDE" stroke-width="2" stroke-linecap="square" stroke-linejoin="round"/>
          <path d="M1.06567 12.4405H15.7323" stroke="#DCDDDE" stroke-width="2" stroke-linecap="square" stroke-linejoin="round"/>
          </svg>
        </div>
    </div>`
    search.innerHTML = `
    <div id="searchWrapper" style="    
      position: absolute; 
      width: 204px;
      height: 30px;
      padding-left: 8px;
      background-color: #292B2F;
      color: #838487;
      top: 9px;
      left: 74px;
      line-height: 30px;
      border-radius: 4px"
      ><input id="searchbar" type="text" name="search" placeholder="${!!document.getElementsByClassName("public-DraftEditorPlaceholder-inner")[0] ? document.getElementsByClassName("public-DraftEditorPlaceholder-inner")[0].innerHTML : "..." }" required> 
      <div class="searchButt" style="width: 17px; height: 17px; right: 10px; position: absolute; top: 7px;">
        <svg class="searchButtonSvg" aria-hidden="true" role="img" viewBox="0 0 20 20">
          <path width="50px" height="50px" fill-rule="evenodd" clip-rule="evenodd" d="M10.5635 9.55348L14.3744 13.3643C14.5083 13.4984 14.5835 13.6801 14.5835 13.8696C14.5834 14.0591 14.5081 14.2408 14.374 14.3748C14.24 14.5087 14.0582 14.5839 13.8687 14.5838C13.6792 14.5838 13.4975 14.5084 13.3636 14.3744L9.55275 10.5636C8.41354 11.4459 6.98099 11.8611 5.5465 11.7248C4.11202 11.5884 2.78337 10.9107 1.83084 9.82946C0.878309 8.74824 0.37345 7.34476 0.418968 5.90453C0.464487 4.4643 1.05696 3.09551 2.07587 2.0766C3.09477 1.0577 4.46357 0.465219 5.9038 0.419701C7.34403 0.374182 8.74751 0.879041 9.82872 1.83157C10.9099 2.7841 11.5877 4.11276 11.724 5.54724C11.8604 6.98172 11.4452 8.41428 10.5628 9.55348H10.5635ZM6.08333 10.3334C7.2105 10.3334 8.29151 9.88559 9.08853 9.08856C9.88556 8.29153 10.3333 7.21053 10.3333 6.08336C10.3333 4.95619 9.88556 3.87518 9.08853 3.07815C8.29151 2.28112 7.2105 1.83336 6.08333 1.83336C4.95616 1.83336 3.87516 2.28112 3.07813 3.07815C2.2811 3.87518 1.83333 4.95619 1.83333 6.08336C1.83333 7.21053 2.2811 8.29153 3.07813 9.08856C3.87516 9.88559 4.95616 10.3334 6.08333 10.3334Z"/>
        </svg>
      </div>
    </div>`

    bar.onclick = function () {
      if (!isSearch) updateSearchServers();
      toggleMenu();
    };
    let isThere2 = scroller.querySelector("#bar");
    let isThere3 = scroller.querySelector("#searchWrapper");

    if (!isThere2) scroller.prepend(bar);
    if (!isThere3) scroller.prepend(search);

    document.getElementsByClassName("searchButt")[0].onmousedown = () => {
      if (searchInput.value = "") return;

      searchInput.value = "";
      inputLogic(searchInput, false);
    }
   
    AddServerBlocks(items());

    const searchInput = document.getElementById("searchbar");
    searchInput.addEventListener("input", (e) => inputLogic(e));
    searchInput.addEventListener("change", (e) => inputLogic(e));
    

    function inputLogic(e, isEvent = true) {
      
      let value = ""
      if (isEvent) {
        value = e.target.value;
      } else {
        value = e.value;
      } 

      if (value && value.trim().length > 0) value = value.trim().toLowerCase();
      searchByName(value);  
    }

    function toggleMenu() {
      menuIsOpen() ? setMenu(false) : setMenu(true);
    }

    function setMenu(is) {
      if (is) {
        scrollerda.style.width = "300px";

        for (let i = 0; i < folders.length; i++) {
          const e = folders[i];
          e.style.width = "275px";
        }

        separatorWrapper.style.width = "262px";
        separatorWrapper.style.justifyContent = "left";
        separatorWrapper.style.marginLeft = "20px";

        separatorWrapper.firstChild.style.width = "254px";
      } else {
        scrollerda.style.width = "72px";
        for (let i = 0; i < folders.length; i++) {
          const e = folders[i];
          e.style.width = "48px";
        }

        separatorWrapper.style.width = "";
        separatorWrapper.style.justifyContent = "";
        separatorWrapper.style.marginLeft = "";

        separatorWrapper.firstChild.style.width = "";
      }
      
    }
    
    function trimFileName(str, noOfChars, appendix) {
      let nameArray = str.split(".");
      let fileName = nameArray.join(" ");

      if (fileName.length >= noOfChars) {
        fileName = fileName.substr(0, noOfChars) + appendix;
      };

      return fileName;
    }

    //ЕБАТЬ ВЫ СМЕЛЫЙ...
    
    function searchByName(value) {
      updateServers();
      updateSearchServers();
      onStartSearch();

      if (serversElementsInGroups.length > 0) serversElements = serversElements.concat(serversElementsInGroups);
      let serversNames = [];
      serversElements[0].parentElement.style.display = "flex";
      serversElements[0].parentElement.style.flexDirection = "column";     

      for (let i = 0; i < serversElements.length; i++) {
        const e = serversElements[i];
        let server = { name: e.childNodes[1].firstChild.getAttribute("data-dnd-name"), order: e.style.order, i: i };
        serversNames.push(server);
        e.style.display = "none";
      }

      if (value == "") {
        onEndSearch();
        return;
      } 

      let keyword = value;
      let search_results = serversNames
        .filter(prof => {
            // Filter results by doing case insensitive match on name here
            return prof?.name?.toLowerCase()?.includes(keyword?.toLowerCase());
        })
        .sort((a, b) => {
            // Sort results by matching name with keyword position in name
            if(a.name.toLowerCase().indexOf(keyword.toLowerCase()) > b.name.toLowerCase().indexOf(keyword.toLowerCase())) {
                return 1;
            } else if (a.name.toLowerCase().indexOf(keyword.toLowerCase()) < b.name.toLowerCase().indexOf(keyword.toLowerCase())) {
                return -1;
            } else {
                if(a.name > b.name)
                    return 1;
                else
                    return -1;
            }
        });
      
      for (let i = 0; i < search_results.length; i++) {
        const e = search_results[i];
        serversElements[e.i].style.order = i;
        serversElements[e.i].style.display = "flex";

        serversElements[e.i].childNodes[1].firstChild.setAttribute("draggable", "false");

      }
      for (let i = 0; i < folders.length; i++) {
        const e = folders[i];
        let findIndex = Array.from(e.nextSibling.nextSibling.children).findIndex(e => e.style.display != "none")
        for (let z = 0; z < Array.from(e.nextSibling.nextSibling.children).length; z++) {
          const a = Array.from(e.nextSibling.nextSibling.children)[z];
        }
        if (findIndex >= 0) {
          e.parentElement.style.display = "flex";
          continue;
        } else {
          e.parentElement.style.display = "none";
        }
      }
      function onStartSearch() {
        isSearch = true;

        all = Array.from(folders[0].parentElement.parentElement.children);

        for (let i = 0; i < folders.length; i++) {
          for (let z = 0; z < folders[i].nextSibling.nextSibling.children.length; z++) {
            const e = folders[i].nextSibling.nextSibling.children[z];
            e.style.order = i;
          }

          folders[i].parentElement.style.order = all.indexOf(folders[i].parentElement);
          
          folders[i].parentElement.style.display = "flex";
          folders[i].parentElement.style.flexDirection = "column";
          folders[i].nextSibling.nextSibling.style.display = "flex";
          folders[i].nextSibling.nextSibling.style.flexDirection = "column";
          folders[i].nextSibling.nextSibling.style.height = "";

          folders[i].nextSibling.style.pointerEvents = "none";
        }

        setIcon(false);
      }
      function onEndSearch() {
        isSearch = false;
        for (let i = 0; i < serversNames.length; i++) {
          const e = serversNames[i];
          serversElements[e.i].style.order = "";
          serversElements[e.i].style.display = "flex";
          serversElements[e.i].childNodes[1].firstChild.setAttribute("draggable", "true");
          
        }

        for (let i = 0; i < folders.length; i++) {
          const e = folders[i];
          e.parentElement.style.order = "";
          e.parentElement.style.display = "flex";
          e.nextSibling.style.pointerEvents = "";
          
        }
        setIcon(true);
        return;
      }

      function setIcon(isSearch) {
        let e = document.getElementsByClassName("searchButt")[0];
        if (isSearch) {
          e.innerHTML = `
          <svg class="searchButtonSvg" aria-hidden="true" role="img" viewBox="0 0 20 20">
            <path width="16px" height="16px" fill-rule="evenodd" clip-rule="evenodd" d="M10.5635 9.55348L14.3744 13.3643C14.5083 13.4984 14.5835 13.6801 14.5835 13.8696C14.5834 14.0591 14.5081 14.2408 14.374 14.3748C14.24 14.5087 14.0582 14.5839 13.8687 14.5838C13.6792 14.5838 13.4975 14.5084 13.3636 14.3744L9.55275 10.5636C8.41354 11.4459 6.98099 11.8611 5.5465 11.7248C4.11202 11.5884 2.78337 10.9107 1.83084 9.82946C0.878309 8.74824 0.37345 7.34476 0.418968 5.90453C0.464487 4.4643 1.05696 3.09551 2.07587 2.0766C3.09477 1.0577 4.46357 0.465219 5.9038 0.419701C7.34403 0.374182 8.74751 0.879041 9.82872 1.83157C10.9099 2.7841 11.5877 4.11276 11.724 5.54724C11.8604 6.98172 11.4452 8.41428 10.5628 9.55348H10.5635ZM6.08333 10.3334C7.2105 10.3334 8.29151 9.88559 9.08853 9.08856C9.88556 8.29153 10.3333 7.21053 10.3333 6.08336C10.3333 4.95619 9.88556 3.87518 9.08853 3.07815C8.29151 2.28112 7.2105 1.83336 6.08333 1.83336C4.95616 1.83336 3.87516 2.28112 3.07813 3.07815C2.2811 3.87518 1.83333 4.95619 1.83333 6.08336C1.83333 7.21053 2.2811 8.29153 3.07813 9.08856C3.87516 9.88559 4.95616 10.3334 6.08333 10.3334Z"/>
          </svg>`
        } else {
          e.innerHTML = `
          <svg class="searchButtonSvg isSearch" aria-hidden="true" role="img" viewBox="0 0 20 20" transform: translate(0, 1px);>
            <path d="M11.6044 0.484665L6.50088 5.58821L1.39733 0.484665C1.27458 0.372339 1.11323 0.311704 0.946885 0.315389C0.780541 0.319075 0.622032 0.386798 0.50438 0.50445C0.386728 0.622102 0.319005 0.780611 0.31532 0.946955C0.311634 1.1133 0.372269 1.27465 0.484595 1.3974L5.58555 6.50095L0.4833 11.6032C0.420966 11.6626 0.371136 11.7339 0.336739 11.8128C0.302343 11.8918 0.284075 11.9768 0.283009 12.0629C0.281942 12.149 0.298099 12.2344 0.33053 12.3142C0.362961 12.394 0.41101 12.4664 0.471855 12.5274C0.532699 12.5883 0.60511 12.6364 0.684832 12.669C0.764553 12.7015 0.849976 12.7178 0.936079 12.7169C1.02218 12.7159 1.10723 12.6978 1.18622 12.6635C1.2652 12.6292 1.33654 12.5795 1.39604 12.5172L6.50088 7.41498L11.6044 12.5185C11.7272 12.6308 11.8885 12.6915 12.0549 12.6878C12.2212 12.6841 12.3797 12.6164 12.4974 12.4987C12.615 12.3811 12.6827 12.2226 12.6864 12.0562C12.6901 11.8899 12.6295 11.7285 12.5172 11.6058L7.41361 6.50224L12.5172 1.3974C12.5795 1.33799 12.6293 1.26673 12.6637 1.18779C12.6981 1.10885 12.7164 1.02383 12.7174 0.937727C12.7185 0.851625 12.7024 0.766179 12.6699 0.686412C12.6375 0.606645 12.5894 0.534165 12.5286 0.473234C12.4678 0.412304 12.3953 0.364151 12.3156 0.331608C12.2359 0.299064 12.1505 0.282786 12.0644 0.28373C11.9783 0.284675 11.8932 0.302822 11.8142 0.337107C11.7353 0.371391 11.6639 0.42112 11.6044 0.48337V0.484665Z"/>
          </svg>`
        }
      }
    
    }

    function updateSearchServers() {
      for (let i = 0; i < allServersElements.length; i++) {
        const e = allServersElements[i];

        let ea = e.querySelectorAll('.folderIconWrapper-1oRIZr')[0];
        if (!ea) continue;

        if (ea.parentElement.getAttribute("aria-expanded") == "false") ea.click();

      }
      setTimeout(() => {
        serversElementsInGroups = allServersElements.filter(e => (e.parentElement?.id.includes("folder-items")));
      }, 50);

    }

    function updateServers() {
      for (let i = 0; i < folders.length; i++) {
        foldersElements.push(folders[i].nextSibling.nextSibling);
      }
      allServersElements = Array.from(document.getElementsByClassName("listItem-3SmSlK"));
      serversElements = allServersElements.filter(e => e.parentElement?.nextSibling?.className == "tutorialContainer-2jwoiB");

      servers = [];
      var MemberCountStore = BdApi.findModuleByProps('getMemberCount');
      var MemberCountStore = BdApi.findModuleByProps('getMemberCount');

      var Guilds = Object.values(BdApi.findModuleByProps('getGuilds').getGuilds());
      var me = BdApi.findModuleByProps('getCurrentUser').getCurrentUser().id;
      var sortFunction = (a, b) => {
          if(a.name < b.name) return -1;
          if(a.name > b.name) return 1;
          return 0;
      };
      var myServers = Guilds.filter((guild) => guild.ownerId === me).sort(sortFunction);
      var external = Guilds.filter((guild) => guild.ownerId !== me).sort(sortFunction);

      var createGuildsMap = (guilds) => guilds.map((guild) => {
        let server = { id: guild.id, Members: MemberCountStore.getMemberCount(guild.id) };
        servers.push(server);
        return `\t${guild.name}:\n${[`\t\tID: ${guild.id}`, `\t\tMembers: ${MemberCountStore.getMemberCount(guild.id)}`].join("\n")}`;
        
      }).join("\n");

      var myText = 
      `${myServers.length ? `Owned Servers: (${myServers.length})\n${createGuildsMap(myServers)}` : ''}
      ${external.length ? `External Servers: (${external.length})\n${createGuildsMap(external)}` : ''}
      `
    }
  
    function AddServerBlocks(arr) {
      updateServers();
    
      for (let i = 0; i < arr.length; i++) {
        AddServerBlock(arr[i], i, arr.length);
      }
    }
    
    function AddServerBlock(parent, i, parentLenght = 1,) {
      let buttonType;
      let id = -1;
      let serverPrefab = document.createElement("div");
      serverPrefab.innerHTML = `
      <div class="serverPrefab" style="
      position: absolute;
      left: 74px;
      bottom: 1px;
      height: 46px;
      background-color: transparent;
      width: 198px;
      font-family: 'Whitney';
      font-size: 16px;
      font-weight: 600;
      line-height: 48px;
      letter-spacing: 0em;
      text-align: left;
      color: #DCDDDE;"
      ><div></div></div>`
      let str = "";
      var maxLength = 22;
      if (parent?.firstChild?.className == "guildSeparator-a4uisj") return;
      buttonType = Type.server;

      if (parent?.parentElement?.className == "tutorialContainer-1pL9QS") { // Личные сообщения
        //console.log("Личные");
        buttonType = Type.ls;
        let e = parent?.querySelectorAll('.wrapper-3kah-n')[0];
        
        str = e.getAttribute("aria-label");
      }
      else if (parent?.parentElement.className == "wrapper-38slSD") { // Группы
        //console.log("Группы");
        buttonType = Type.group;
        serverPrefab.children[0].style.lineHeight = "48px";
        serverPrefab.children[0].style.fontWeight = "800";
        str = parent?.childNodes[1]?.getAttribute("data-dnd-name");;

        
        
      }
      else if (parent?.parentElement.className == "tutorialContainer-2jwoiB") { //Добавить сервер
        //console.log("Добавить");
        buttonType = Type.addServer;
        serverPrefab.children[0].style.lineHeight = "48px";
        serverPrefab.children[0].style.fontWeight = "800";
        let e = parent?.querySelectorAll('.circleIconButton-1VxDrg')[0];
        
        str = e.getAttribute("aria-label");
      }
      else if (parentLenght != -1 && i == parentLenght - 1 && parent?.nextSibling && parent?.nextSibling?.getAttribute("aria-hidden") != "") { //Публичные Сервера\
        
        //console.log("Публичные: " + parent?.nextSibling);
        buttonType = Type.servers;
        serverPrefab.children[0].style.lineHeight = "48px";
        serverPrefab.children[0].style.fontWeight = "800";
        let e = parent?.querySelectorAll('.circleIconButton-1VxDrg')[0];
        
        str = e.getAttribute("aria-label");
      }
      else if (parent?.childNodes[1]?.firstChild?.getAttribute("data-dnd-name") != "" && parent?.childNodes[1]?.firstChild.getAttribute("data-dnd-name") != null && parent?.childNodes[1]?.className != "listItemWrapper-3d87LP") { //Сервер
        //console.log("Сервер");
        openFolders();
        str = parent?.childNodes[1]?.firstChild?.getAttribute("data-dnd-name") + "";
        let e = parent?.childNodes[1]?.firstChild?.firstChild.firstChild.lastChild.firstChild;
        
        id = e?.getAttribute("data-list-item-id")?.split('___');

        if (!id) return;

        let members = servers.find((x) => x.id == id[1]).Members;

        let membersBlock = `
        <div class="downBlock" style="
            height: 12px;
            margin-top: 9px;
            width: 200px;
            background-color: transparent;
            opacity: 75%;
            "><div style="
                background-color: #B9BBBE;
                height: 8px;
                width: 8px;
                border-radius: 17px;
                color: #b9bbbe;
                "><p style="position: absolute;
            left: 15px;
            margin: 0;
            margin-top: -4px;
            font-size: 12px;">${members} ${Langs[lang] ? Langs[lang] : Langs[en]} </p></div>
                    </div>
                  `
        serverPrefab.children[0].children[0].insertAdjacentHTML('beforeend', membersBlock);
        
        serverPrefab.children[0].classList.add("NonCenter");
      }

      else if (parent?.childNodes[1]?.classList[0] == "listItemWrapper-3d87LP") { // Сообщение / звонок
        parent?.classList.add("NonCentaaer");
        buttonType = Type.msg;
        
        str = parent?.childNodes[1]?.firstChild?.firstChild?.childNodes[3].firstChild?.getAttribute("aria-label") + "";
      }
      if(str.length > maxLength){
        str = trimFileName(str, 20, "...")
      }

      let ea;
      serverPrefab.children[0].children[0].prepend(document.createTextNode(str));
      function checkType() {
        
        switch (buttonType) {
          case Type.ls:
            ea = parent?.querySelectorAll('.childWrapper-1j_1ub')[0];
            break;
          case Type.server:
            ea = parent?.querySelectorAll('.wrapper-3kah-n')[0];
            break;
          case Type.msg:
            ea = parent?.querySelectorAll('.wrapper-3kah-n')[0];
            break;
          case Type.group:
            ea = parent?.querySelectorAll('.folderIconWrapper-1oRIZr')[0];
            buttonType.isopen = ea.parentElement.getAttribute("aria-expanded");
            break;
          case Type.addServer:
            ea = parent?.querySelectorAll('.circleIconButton-1VxDrg')[0];
            break;
          case Type.servers:
            ea = parent?.querySelectorAll('.circleIconButton-1VxDrg')[0];
            break;
          default:
            break;
        }

        subscribe();
      }

      function subscribe() {
        if (!!ea) {
          ea.oncontextmenu = function () {
            setTimeout(() => {
              let context = document.querySelector("#guild-context");

              context.style.visibility = "visible";
            }, 330);
          }

          ea.onclick = (e) => {
            if (!buttonType.isopen) return;
            
            setTimeout(() => {
              let mainFolder;
              let par = e.target?.parentElement?.parentElement?.parentElement?.parentElement?.parentElement?.parentElement?.parentElement;
              
              if (e.target.className == "expandedFolderIconWrapper-3RwQpD") {
                mainFolder = par?.parentElement;
              } else if (e.target.className == "closedFolderIconWrapper-3tRb2d") {
                mainFolder = par?.parentElement;
              } else {
                if (par) mainFolder = par;
              }

              let folderItems = mainFolder?.querySelectorAll("[id^='folder-items-']")[0]?.children;
              updateServers();
              AddServerBlocks(folderItems);
              
            }, 40);
          }
        }
      }

      function openFolders() {
        if (menuIsOpen()) {
          for (let i = 0; i < folders.length; i++) {
            const e = folders[i];
            e.style.width = "275px";
          }
        }
      }
      checkType();
      
      serverPrefab.onclick = function () {
        checkType();
        ea.click();
      }

      serverPrefab.onmouseenter = function () {
        checkType();
        FireEvent(ea, "mouseover");
      }

      serverPrefab.onmouseleave = function () {
        checkType();
        FireEvent(ea, "mouseout");
      }
      serverPrefab.onmouseup = function () {
        checkType();
        FireEvent(ea, "mouseup");
      }

      serverPrefab.oncontextmenu = function (e) {
        checkType();

        if (e.target.parentElement.className.split(" ")[0] == "serverPrefab") {
          FireEvent(ea, "contextmenu");
        setTimeout(() => {
          let context = document.querySelector("#guild-context");
          //context.parentElement.style.visibility = "hidden";
          let myHeight = window.innerHeight;
          let currentHeight = myHeight - e.pageY;
          let topOffset;
          if (currentHeight <= context.offsetHeight) {
            topOffset = myHeight - context?.offsetHeight - 20;
          }
          else {
            topOffset = e.pageY;
          }
          
          context.parentElement.style.left = e.pageX + "px";
          context.parentElement.style.top = topOffset + "px";

          context.style.visibility = "visible";
        }, 40);
        };
        
        
      }
      
      if (!parent) return;
      const e = parent;
      
      let isThere = e.querySelector(".serverPrefab");

      if (!isThere) e.appendChild(serverPrefab);
    }

    //Понятно, даун.......

    function FireEvent( ElementId, EventName )
      {
          if( ElementId != null )    
          {   
              if( ElementId.fireEvent ) 
              {
                  ElementId.fireEvent( 'on' + EventName );     
              }
              else 
              {   
                  var evObj = document.createEvent( 'Events' );
                  evObj.initEvent( EventName, true, false );
                  ElementId.dispatchEvent( evObj );
              }
          }
      }
    let darkPintStyle = document.createElement("style");
    darkPintStyle.innerHTML = `#guild-context {
      visibility: hidden;
    }
    .ownButton {
      position: absolute;
      width: 35px;
      height: 35px;
      background-color: transparent;
      transform: translate(15%, 6%);
      border-radius: 4px;
    }
    .ownButton:hover {
      background-color: #292B2F;
    }
    .NonCenter {
      display: flex;
      align-items: center;
      line-height: initial !important;
    }
    

    #searchbar{
      background-color: transparent;
      border: none;
      width: 80%;
      color: #838487;
      font-size: 14px;
      font-weight: 600;
    }

    #searchbar::placeholder {
      color: #838487;
      font-size: 14px;
      font-weight: 600;
      
    }

  #list{
    font-size:  1.5em;
    margin-left: 90px;
   }
   .serverPrefab { 
      font-family: 'Whitney' !important;
      font-size: 16px !important;
      font-weight: 600 !important;
   }
 
.animals{
   display: list-item;    
  } 
  .tooltip-14MtrL {
    pointerEvents: none;
  }
  .searchButtonSvg {
    width: 20px;
    fill: #818285;
  }
  .isSearch {
    margin-top: 1px;
  }
  .isSearch:hover {
    fill: white;
  }
    `
    darkPintStyle.id = "darkPintStyle";

    discordMenu.appendChild(darkPintStyle);

  }
  
  stop() {
    // Cleanup when disabled
    RemoveAll();
  }

};

function RemoveAll() {
  let id = setInterval(() => {
    let scrollerda = document.getElementsByClassName("wrapper-1_HaEi guilds-2JjMmN")[0];
    let separatorWrapper = Array.from(document.getElementsByClassName("listItem-3SmSlK")).find(e => e.firstChild.className == "guildSeparator-a4uisj");
    let folders = document.getElementsByClassName("expandedFolderBackground-1kSAf6");
    const searchInput = document.getElementById("searchbar");

    if (scrollerda && separatorWrapper) {
      document.querySelectorAll('.serverPrefab').forEach(e => e.remove());
      document.querySelector('.ownButton').parentElement.parentElement.parentElement.remove();
      searchInput.value = "";
      StartEvent(searchInput, "change");
      setTimeout(() => {
        document.querySelector('.searchBar').remove();
        document.querySelector('#discordMenu').remove();

        scrollerda.style.width = "72px";
        for (let i = 0; i < folders.length; i++) {
          const e = folders[i];
          e.style.width = "48px";
        }
        separatorWrapper.style.width = "";
        separatorWrapper.style.justifyContent = "";
        separatorWrapper.style.marginLeft = "";

        separatorWrapper.firstChild.style.width = "";

        
        searchInput.addEventListener("input", (e) => inputLogic(e));
        searchInput.addEventListener("change", (e) => inputLogic(e));
        clearInterval(id);
      }, 200);
      
    } 

  }, 500);
}

function StartEvent( ElementId, EventName )
{
    if( ElementId != null )    
    {   
        if( ElementId.fireEvent ) 
        {
            ElementId.fireEvent( 'on' + EventName );     
        }
        else 
        {   
            var evObj = document.createEvent( 'Events' );
            evObj.initEvent( EventName, true, false );
            ElementId.dispatchEvent( evObj );
        }
    }
}

var Langs = {
  bg: "Членове", //"Bulgarian",
  cs: "Členů", //"Czech",
  da: "Medlemmer", //"Danish",
  de: "Mitglieder", //"German",
  el: "Μέλη", //"Greek",
  en: "Members", //"English",
  fi: "Jäsentä", //"Finnish",
  fr: "Membres", //"French",
  hi: "मेम्बर", //"Hindi",
  hr: "Članova", //"Croatian",
  hu: "Tag", //"Hungarian",
  it: "Membri", //"Italian",
  ja: "人", //"Japanese",
  ko: "명", //"Korean",
  lt: "Nariai", //"Lithuanian",
  nl: "Leden", //"Dutch",
  no: "medlemmer", //"Norwegian",
  pl: "Członków", //"Polish",
  pt: "Membros", //"Portuguese",
  ro: "membri", //"Romanian",
  ru: "Участников", //"Russian",
  es: "Miembros", //"Spanish",
  sv: "Medlemmar", //"Swedish",
  th: "คน", //"Thai",
  tr: "Üye", //"Turkish",
  uk: "Учасників", //"Ukrainian",
  vi: "Thành viên", //"Vietnamese",
  zh: "位成员" //"Chinese"
}