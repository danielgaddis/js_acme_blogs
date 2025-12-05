function createElemWithText(elementName = "p", textContent = "", className)
{
    const element = document.createElement(elementName);
    element.textContent = textContent;

    if(className)
    {
        element.className = className;
    }

    return element;
}

function createSelectOptions(users)
{
    if(!users || !Array.isArray(users))
    {
        return undefined;
    }

    const options = [];

    for(const user of users)
    {
        const option = document.createElement("option");
        option.value = user.id;
        option.textContent = user.name;
        options.push(option);
    }

    return options;
}

function toggleCommentSection(postId)
{
    if(!postId)
    {
        return undefined;
    }

    const section = document.querySelector(`section[data-post-id="${postId}"]`);
    
    if (!section) 
    {
        console.warn(`No comment section found for postId: ${postId}`);
        return null;
    }

    section.classList.toggle('hide');

    return section;
}


function toggleCommentButton(postId) 
{
    if(!postId)
    {
        return undefined;
    }

    const button = document.querySelector(`button[data-post-id="${postId}"]`);

    if (!button) 
    {
        console.warn(`No button found for postId: ${postId}`);
        return null;
    }
    
    if (button.textContent === 'Show Comments') 
    {
        button.textContent = 'Hide Comments';
    } 
    else 
    {
        button.textContent = 'Show Comments';
    }

    return button;
}

function deleteChildElements(parentElement)
{
    if (!(parentElement instanceof HTMLElement)) 
    {
        return undefined;
    }

    let child = parentElement.lastElementChild;

    while (child) 
    {
        parentElement.removeChild(child);
        child = parentElement.lastElementChild;
    }

    return parentElement;
}


function addButtonListeners() 
{
    const buttons = document.querySelectorAll('main button');

    if (buttons.length === 0) 
    {
        console.warn('No buttons found inside <main>.');
        return [];
    }

    buttons.forEach(button => {
        const postId = button.dataset.postId;

        if (postId) 
        {
            button.addEventListener('click', function(event) {
                toggleComments(event, postId);
            });
        }
    });

    return buttons;
}

function removeButtonListeners() 
{
    const buttons = document.querySelectorAll('main button');

    buttons.forEach(button => {
        const postId = button.dataset.postId;

        if (postId) 
        {
            button.removeEventListener('click', function(event) {
                toggleComments(event, postId);
            });
        }
    });

    return buttons;
}

function createComments(commentsData) 
{
    if(!commentsData)
    {
        return undefined;
    }

    const fragment = document.createDocumentFragment();

    commentsData.forEach(comment => {
        const article = document.createElement('article');
        const h3 = createElemWithText('h3', comment.name);
        const pBody = createElemWithText('p', comment.body);
        const pEmail = createElemWithText('p', `From: ${comment.email}`);
        article.append(h3, pBody, pEmail);
        fragment.appendChild(article);
    });

    return fragment;
}

function populateSelectMenu(users) 
{
    if(!users || !Array.isArray(users))
    {
        return undefined;
    }

    const selectMenu = document.getElementById('selectMenu');
    const options = createSelectOptions(users);
    options.forEach(option => selectMenu.appendChild(option));
    return selectMenu;
}

async function getUsers() 
{
    try 
    {
        const response = await fetch('https://jsonplaceholder.typicode.com/users');
        
        if (!response.ok) 
        {
            throw new Error("HTTP error! Status: ${response.status}");
        }

        const data = await response.json();
        return data;
    } 
    catch (e) 
    {
        console.error("Error fetching users: ", e);
        return null;
    }
}

async function getUserPosts(userId) 
{
    if(!userId)
    {
        return undefined;
    }

    try 
    {
        const response = await fetch(`https://jsonplaceholder.typicode.com/posts?userId=${userId}`);
        
        if (!response.ok) 
        {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } 
    catch (e) 
    {
        console.error('Error fetching user posts:', e);
        return null;
    }
}

async function getUser(userId) 
{
    if(!userId)
    {
        return undefined;
    }

    try 
    {
        const response = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}`);
        
        if (!response.ok) 
        {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } 
    catch (e) 
    {
        console.error('Error fetching user:', e);
        return null;
    }
}


async function getPostComments(postId) 
{
    if(!postId)
    {
        return undefined;
    }

    try 
    {
        const response = await fetch(`https://jsonplaceholder.typicode.com/comments?postId=${postId}`);
        
        if (!response.ok) 
        {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } 
    catch (e) 
    {
        console.error('Error fetching post comments:', e);
        return null;
    }
}

async function displayComments(postId) 
{
    if(!postId)
    {
        return undefined;
    }

    try 
    {
        const section = document.createElement('section');
        section.dataset.postId = postId;
        section.classList.add('comments', 'hide');
        const comments = await getPostComments(postId);
        const fragment = createComments(comments);
        section.appendChild(fragment);
        return section;
    } 
    catch (e) 
    {
        console.error('Error displaying comments:', e);
        return null;
    }
}

async function createPosts(posts) 
{
    if(!posts)
    {
        return undefined;
    }

    try 
    {
        const fragment = document.createDocumentFragment();

        for (const post of posts) 
        {
            const article = document.createElement('article');
            const h2 = createElemWithText('h2', post.title);
            const pBody = createElemWithText('p', post.body);
            const pId = createElemWithText('p', `Post ID: ${post.id}`);
            const author = await getUser(post.userId);
            const pAuthor = createElemWithText('p', `Author: ${author.name} with ${author.company.name}`);
            const pCatchPhrase = createElemWithText('p', author.company.catchPhrase);
            const button = createElemWithText('button', 'Show Comments');
            button.dataset.postId = post.id;
            const section = await displayComments(post.id);
            article.append(h2, pBody, pId, pAuthor, pCatchPhrase, button, section);
            fragment.appendChild(article);
        }

        return fragment;
    } 
    catch (e) 
    {
        console.error('Error creating posts:', e);
        return null;
    }
}


async function displayPosts(posts) 
{
    try 
    {
        const main = document.querySelector('main');

        const element = posts && posts.length
            ? await createPosts(posts)
            : (() => {
                const p = createElemWithText('p', 'Select an Employee to display their posts.');
                p.classList.add('default-text');
                return p;
            })();

        main.appendChild(element);
        return element;
    } 
    catch (e) 
    {
        console.error('Error displaying posts:', e);
        return null;
    }
}

function toggleComments(event, postId) 
{
    if(!event || !event.target || !postId)
    {
        return undefined;
    }

    try 
    {
        event.target.listener = true;
        const section = toggleCommentSection(postId);
        const button = toggleCommentButton(postId);
        return [section, button];
    } 
    catch (e) 
    {
        console.error('Error toggling comments:', e);
        return null;
    }
}

async function refreshPosts(posts) 
{
    if(!posts)
    {
        return undefined;
    }

    try 
    {
        const removeButtons = removeButtonListeners();
        const main = document.querySelector('main');
        const deletedMain = deleteChildElements(main);
        const fragment = await displayPosts(posts);
        const addButtons = addButtonListeners();
        return [removeButtons, deletedMain, fragment, addButtons];
    } 
    catch (e) 
    {
        console.error('Error refreshing posts:', e);
        return null;
    }
}

async function selectMenuChangeEventHandler(event) 
{
    if (!event || !event.target) 
    {
        return undefined;
    }

    const selectElement = event.target;

    try 
    {
        selectElement.disabled = true;
        const userId = parseInt(selectElement.value, 10) || 1;
        const posts = await getUserPosts(userId);

        if (!Array.isArray(posts)) 
        {
            throw new Error('getUserPosts did not return an array');
        }

        const refreshPostsArray = await refreshPosts(posts);

        if (!Array.isArray(refreshPostsArray)) 
        {
            throw new Error('refreshPosts did not return an array');
        }

        return [userId, posts, refreshPostsArray];
    } 
    catch (e) 
    {
        console.error('Error handling select menu change:', e);
        return null;
    } 
    finally 
    {
        selectElement.disabled = false;
    }
}

async function initPage() 
{
    try 
    {
        const users = await getUsers();
        const select = populateSelectMenu(users);
        return [users, select];
    } 
    catch (e) 
    {
        console.error('Error initializing page:', e);
        return null;
    }
}

function initApp() 
{
    initPage();
    const selectMenu = document.getElementById('selectMenu');
    selectMenu.addEventListener('change', selectMenuChangeEventHandler);
}

document.addEventListener('DOMContentLoaded', initApp);