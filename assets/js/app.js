/**
 * assets/js/app.js
 * Mr.BossBaby Academy - Core Frontend JavaScript (i18n + Dynamic Courses + Admin CRUD)
 * REVISED by Gemini AI
 */

const App = (() => {
    /* -----------------------------------------
       Configuration & State
    ----------------------------------------- */
    let state = {
        lang: 'my', // Default language is Burmese
        courses: [],
        i18n: {}, // Will be loaded with translations
        ADMIN_PASSWORD: 'aiobabyboss',
        isAdminMode: false,
    };

    // Helper function for DOM selection
    const $ = (selector) => document.querySelector(selector);
    
    const DOM = {
        coursesList: document.getElementById('coursesList'),
        adminTrigger: document.getElementById('adminTrigger'),
        passwordModal: document.getElementById('passwordModal'),
        addCourseModal: document.getElementById('addCourseModal'),
        adminPanel: document.getElementById('adminPanel'),
        navLinks: document.getElementById('navLinks'),
        langBtn: document.getElementById('lang-toggle-btn'),
        menuToggle: document.getElementById('menu-toggle') // Assuming you have a mobile menu toggle button
    };
    
    // Default Initial Courses (Using original image links from Code 1)
    const defaultCourses = [
      {
        id: 1,
        title: { my: "Termux & Linux Pentesting Class", en: "Termux & Linux Pentesting Class" },
        img: "https://i.ibb.co/Ndv8L6r8/IMG-20251010-031629-534.jpg",
        badge: { my: "အရောင်းရဆုံး", en: "Best Seller" },
        meta: { my: '<i class="fas fa-clock"></i> ၁ လ | <i class="fas fa-video"></i> ဗီဒီယို/ဇူးမ်', en: '<i class="fas fa-clock"></i> 1 Month | <i class="fas fa-video"></i> Video/Zoom' },
        desc: { my: "Android ဖုန်းတစ်လုံးရှိရုံဖြင့် Linux Command များ၊ Ethical Hacking Tool များနှင့် Network Security စစ်ဆေးနည်းများကို အခြေခံမှစ၍ ကျွမ်းကျင်အဆင့်ထိ သင်ကြားပေးမည့် အတန်း။", en: "A course covering Linux Commands, Ethical Hacking Tools, and Network Security auditing from basic to expert level, using just an Android phone." },
        tags: [{my: "Linux Commands", en: "Linux Commands"}, {my: "လုံခြုံရေး စစ်ဆေးခြင်း", en: "Security Audit"}, {my: "သတင်းအချက်အလက် စုဆောင်းခြင်း", en: "Info Gathering"}, {my: "Wifi လုံခြုံရေး", en: "Wifi Security"}],
        price: "100,000 Ks",
        oldPrice: null
      },
      {
        id: 2,
        title: { my: "Full Stack Web & Mobile Masterclass", en: "Full Stack Web & Mobile Masterclass" },
        img: "https://i.ibb.co/0VvCzVj2/IMG-20251020-035209-308.jpg",
        badge: { my: "အလုပ်အကိုင် အခွင့်အလမ်း", en: "Career Choice" },
        meta: { my: '<i class="fas fa-clock"></i> ၃-၅ လ | <i class="fas fa-certificate"></i> အသိအမှတ်ပြု လက်မှတ်', en: '<i class="fas fa-clock"></i> 5-7 Months | <i class="fas fa-certificate"></i> Certified' },
        desc: { my: "Website ရေးဆွဲခြင်း (HTML/CSS/Laravel) မှ Mobile App (Flutter) အထိ Full-Stack Developer တစ်ယောက်အဖြစ် အသက်မွေးဝမ်းကြောင်းပြုလိုသူများအတွက် အပြည့်စုံဆုံး သင်တန်း။", en: "The most comprehensive course for those who want to pursue a career as a Full-Stack Developer, covering Website development (HTML/CSS/Laravel) to Mobile App (Flutter)." },
        tags: [{my: "HTML/CSS/JS", en: "HTML/CSS/JS"}, {my: "PHP Laravel", en: "PHP Laravel"}, {my: "Flutter", en: "Flutter"}, {my: "လက်တွေ့ Project များ", en: "Real Projects"}],
        price: "400,000 Ks",
        oldPrice: "500,000 Ks"
      },
      {
        id: 3,
        title: { my: "Android App Dev (Sketchware)", en: "Android App Dev (Sketchware)" },
        img: "https://i.ibb.co/F4v4yZYy/IMG-20251126-152433-455.jpg", 
        badge: { my: "အစပြုသူများအတွက်", en: "Beginner Friendly" },
        meta: { my: '<i class="fas fa-clock"></i> ၄၀+ သင်ခန်းစာ | <i class="fas fa-laptop-code"></i> ကွန်ပျူတာမလို', en: '<i class="fas fa-clock"></i> 40+ Lessons | <i class="fas fa-laptop-code"></i> No PC Needed' },
        desc: { my: "ကွန်ပျူတာမလို၊ Coding အများကြီး ရေးစရာမလိုဘဲ ဖုန်းတစ်လုံးတည်းဖြင့် မိမိကိုယ်ပိုင် Application များကို ဖန်တီးနိုင်မည့် Logic Based Development သင်တန်း။", en: "A Logic Based Development course that allows you to create your own Applications using only a phone, without needing a computer or extensive coding." },
        tags: [{my: "Block Coding", en: "Block Coding"}, {my: "UI ဒီဇိုင်း", en: "UI Design"}, {my: "Firebase", en: "Firebase"}, {my: "PlayStore လမ်းညွှန်", en: "PlayStore Guide"}],
        price: "100,000 Ks",
        oldPrice: "150,000 Ks"
      }
    ];


    /* -----------------------------------------
       Translation Functions
    ----------------------------------------- */
    async function loadTranslations() {
        try {
            const [mm, en] = await Promise.all([
                fetch('lang/mm.json').then(res => {
                    if (!res.ok) throw new Error("mm.json load failed");
                    return res.json();
                }),
                fetch('lang/eng.json').then(res => {
                    if (!res.ok) throw new Error("eng.json load failed");
                    return res.json();
                })
            ]);
            state.i18n = { my: mm, en: en };
        } catch (error) {
            console.error("Error loading translations. Using hardcoded defaults.", error);
            // Fallback (for environments where JSON loading is restricted) - Use Code 1's basic keys as fallback
            state.i18n = {
                "my": { 
                    "nav.services": "ဝန်ဆောင်မှု", 
                    "nav.courses": "သင်တန်းများ", 
                    "enroll_now": "သင်တန်းအပ်ရန်", 
                    "admin_active": "[ ADMIN MODE ဖွင့်ထားသည် ]", 
                    "pass_auth": "စနစ်သို့ဝင်ရောက်မည်", 
                    "pass_input": "ဝင်ရောက်ခွင့်ကုတ်နံပါတ်", 
                    "modal_title_label": "သင်တန်းခေါင်းစဉ်", 
                    "modal_price_label": "ဈေးနှုန်း (ကျပ်)", 
                    "hero_quote": "နည်းပညာဆိုတာ လူသားတွေရဲ့ လက်နက်ဖြစ်တယ်။ အဲ့ဒီလက်နက်ကို ဘယ်လို စနစ်တကျ၊ လုံခြုံစွာ ကိုင်တွယ်မလဲဆိုတာ ကျွန်တော်တို့ သင်ကြားပေးနေပါတယ်။" ,
                    "lang_switch": "Read in English" // Essential for switch button
                },
                "en": { 
                    "nav.services": "Services", 
                    "nav.courses": "Courses", 
                    "enroll_now": "Enroll Now", 
                    "admin_active": "[ ADMIN MODE ACTIVE ]", 
                    "pass_auth": "AUTHENTICATE", 
                    "pass_input": "Enter Access Code", 
                    "modal_title_label": "Course Title", 
                    "modal_price_label": "Price (Ks)", 
                    "hero_quote": "Technology is humanity's weapon. We teach how to handle that weapon systematically and securely.",
                    "lang_switch": "Read in Burmese" // Essential for switch button
                }
            };
        }
    }

    function applyLanguage() { // Renamed from translateText for better clarity
        const langData = state.i18n[state.lang] || {};

        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            const translation = langData[key];
            if (translation) {
                // Check if the element is an input/textarea for placeholder update
                if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                    // Check for data-i18n-placeholder attribute
                    if (element.hasAttribute('data-i18n-placeholder')) {
                         const placeholderKey = element.getAttribute('data-i18n-placeholder');
                         element.placeholder = langData[placeholderKey] || translation;
                    } else {
                        element.placeholder = translation; // Fallback if no specific placeholder key
                    }
                } else {
                    element.textContent = translation;
                }
            }
        });
        
        // Handle specific elements (IDs)
        const heroQuoteEl = document.getElementById('hero-quote');
        if (heroQuoteEl) {
             heroQuoteEl.textContent = langData.hero_quote || heroQuoteEl.textContent;
        }

        const adminPassEl = document.getElementById('adminPass');
        if (adminPassEl) {
             adminPassEl.placeholder = langData.pass_input || adminPassEl.placeholder;
        }

        // Update Language Button
        if (DOM.langBtn) {
            DOM.langBtn.textContent = langData.lang_switch || DOM.langBtn.textContent;
            // Set font based on language for visual appeal
            DOM.langBtn.style.fontFamily = state.lang === 'my' ? "'Padauk', sans-serif" : "'Poppins', sans-serif";
        }


        // Re-render dynamic content (courses)
        renderCourses();
    }

    function switchLanguage() {
        state.lang = state.lang === 'my' ? 'en' : 'my';
        document.documentElement.lang = state.lang;
        applyLanguage();
    }

    /* -----------------------------------------
       Course Rendering (CRUD R)
    ----------------------------------------- */
    function renderCourses() {
        const container = DOM.coursesList;
        if (!container) return; // Exit if container not found
        
        container.innerHTML = '';
        const enrollText = (state.i18n[state.lang] || {}).enroll_now || (state.lang === 'my' ? "သင်တန်းအပ်ရန်" : "Enroll Now");

        state.courses.forEach((course, index) => {
            // Get bilingual properties, falling back to Burmese if English key is missing
            const getBilingualText = (prop) => (course[prop][state.lang] || course[prop]['my']);
            
            const titleText = getBilingualText('title');
            const badgeText = getBilingualText('badge');
            const metaText = getBilingualText('meta');
            const descText = getBilingualText('desc');
            
            // Handle tags, which are an array of objects
            let tagsHtml = course.tags.map(tagObj => {
                const tagText = (tagObj[state.lang] || tagObj['my']);
                return `<span class="tag">${tagText}</span>`;
            }).join('');
            
            // Price remains constant
            let priceHtml = `<div><span class="price">${course.price}</span>`;
            if (course.oldPrice) {
                priceHtml += `<span class="old-price">${course.oldPrice}</span>`;
            }
            priceHtml += `</div>`;

            const html = `
                <div class="course-item">
                    ${state.isAdminMode ? `<button class="delete-btn" onclick="App.deleteCourse(${index})"><i class="fas fa-trash"></i></button>` : ''}
                    <div class="course-img-wrapper">
                        <img src="${course.img}" alt="${titleText}" class="course-img">
                        <div class="course-badge">${badgeText}</div>
                    </div>
                    <div class="course-content">
                        <h3 class="course-title">${titleText}</h3>
                        <div class="course-meta">${metaText}</div>
                        <p class="course-description">${descText}</p>
                        <div class="syllabus-highlights">${tagsHtml}</div>
                        <div class="price-row">
                            ${priceHtml}
                            <a href="https://t.me/mrbossbabyinfo" target="_blank" class="btn-primary">${enrollText}</a>
                        </div>
                    </div>
                </div>
            `;
            container.innerHTML += html;
        });
    }

    function loadCourses() {
        const storedCourses = localStorage.getItem('bossBabyCourses');
        if (storedCourses) {
            state.courses = JSON.parse(storedCourses);
        } else {
            state.courses = defaultCourses;
            saveToStorage();
        }
    }

    function saveToStorage() {
        localStorage.setItem('bossBabyCourses', JSON.stringify(state.courses));
    }


    /* -----------------------------------------
       Admin Panel Logic (CRUD CUD)
    ----------------------------------------- */

    let clickCount = 0;
    let clickTimer;

    function setupAdminMode() {
        if (!DOM.adminTrigger) return;
        
        // Triple-click mechanism to open password modal
        DOM.adminTrigger.addEventListener('click', (e) => {
            e.preventDefault(); // Prevent default link behavior on triple click
            clickCount++;
            
            clearTimeout(clickTimer);
            
            if (clickCount === 3) {
                if (DOM.passwordModal) {
                    DOM.passwordModal.style.display = 'block';
                    const adminPassInput = document.getElementById('adminPass');
                    if(adminPassInput) adminPassInput.focus();
                }
                clickCount = 0; // Reset after trigger
            } else {
                clickTimer = setTimeout(() => {
                    clickCount = 0; 
                }, 500);
            }
        });
    }

    function checkPassword() {
        const adminPassInput = document.getElementById('adminPass');
        const pass = adminPassInput ? adminPassInput.value : '';
        
        if (pass === state.ADMIN_PASSWORD) {
            activateAdminMode();
            if(DOM.passwordModal) DOM.passwordModal.style.display = 'none';
            if(adminPassInput) adminPassInput.value = '';
        } else {
            alert(state.lang === 'my' ? 'လျှို့ဝှက်ကုတ်နံပါတ် မှားယွင်းနေပါသည်။' : 'ACCESS DENIED: Incorrect Protocol.');
            if(DOM.passwordModal) DOM.passwordModal.style.display = 'none';
        }
    }

    function activateAdminMode() {
        state.isAdminMode = true;
        document.body.classList.add('admin-mode');
        if(DOM.adminPanel) DOM.adminPanel.classList.add('active');
        
        // Update trigger text to indicate mode
        if(DOM.adminTrigger) {
            // Find the correct Admin Mode text from i18n
            const adminActiveText = (state.i18n[state.lang] || {}).admin_active || '[ ADMIN MODE ACTIVE ]';
            
            // Assuming adminTrigger originally contains text like "Admin" or similar
            // We just set the admin_active text and add the icon for clarity
            DOM.adminTrigger.textContent = adminActiveText;
            DOM.adminTrigger.style.color = 'var(--neon-pink, #00ffc6)'; // Using a fallback color
            
        }
        
        renderCourses();
        console.log("Admin Mode Activated.");
    }

    function openAddModal() {
        if (!state.isAdminMode) return;
        if(DOM.addCourseModal) DOM.addCourseModal.style.display = 'block';
    }

    function closeAddModal() {
        if(DOM.addCourseModal) DOM.addCourseModal.style.display = 'none';
    }

    function saveNewCourse() {
        const title = document.getElementById('newTitle').value;
        const img = document.getElementById('newImg').value;
        const badge = document.getElementById('newBadge').value || "New";
        const meta = document.getElementById('newMeta').value;
        const desc = document.getElementById('newDesc').value;
        const tags = document.getElementById('newTags').value.split(',').map(t => t.trim()).filter(t => t !== '');
        const price = document.getElementById('newPrice').value;
        const oldPrice = document.getElementById('newOldPrice').value;

        if(!title || !price) {
            alert(state.lang === 'my' ? "ကျေးဇူးပြု၍ ခေါင်းစဉ်နှင့် ဈေးနှုန်း အနည်းဆုံး ဖြည့်ပါ။" : "Please fill in at least the Title and Price.");
            return;
        }

        // Admin courses are saved with the entered text for both languages 
        // to simplify the process (Code 1 behavior).
        const oppositeLang = state.lang === 'my' ? 'en' : 'my';
        const newCourse = {
            id: Date.now(),
            title: { [state.lang]: title, [oppositeLang]: title }, 
            img,
            badge: { [state.lang]: badge, [oppositeLang]: badge },
            meta: { [state.lang]: meta, [oppositeLang]: meta },
            desc: { [state.lang]: desc, [oppositeLang]: desc },
            tags: tags.map(tag => ({ [state.lang]: tag, [oppositeLang]: tag })),
            price,
            oldPrice: oldPrice || null
        };

        state.courses.push(newCourse);
        saveToStorage();
        renderCourses();
        closeAddModal();
        
        // Clear inputs after save
        document.querySelectorAll('#addCourseModal input, #addCourseModal textarea').forEach(input => input.value = '');
        // Default placeholder image for next addition
        document.getElementById('newImg').value = "https://placehold.co/600x400/0e0e0e/00ffc6?text=New+Class"; 
    }

    function deleteCourse(index) {
        if (!state.isAdminMode) return;
        if(confirm(state.lang === 'my' ? "ဒီသင်တန်းကို ဖျက်ချင်တာ သေချာပါသလား။" : "Are you sure you want to delete this course?")) {
            state.courses.splice(index, 1);
            saveToStorage();
            renderCourses();
        }
    }
    
    // Toggle mobile navigation visibility
    function toggleMobileMenu() {
        if (DOM.navLinks) DOM.navLinks.classList.toggle('active');
    }

    /* -----------------------------------------
       Initialization
    ----------------------------------------- */
    async function init() {
        // Find essential DOM elements that were not retrieved initially
        if(!DOM.coursesList) DOM.coursesList = document.getElementById('coursesList');

        loadCourses(); // Load existing or default courses
        await loadTranslations(); // Load i18n data
        applyLanguage(); // Apply translations and render courses
        setupAdminMode(); // Setup the admin access trigger
        
        // Add event listener for mobile menu toggle (if available)
        if (DOM.menuToggle) {
            DOM.menuToggle.addEventListener('click', toggleMobileMenu);
        }

        // Close modals if clicked outside
        window.onclick = function(event) {
            if (event.target.classList.contains('modal')) {
                event.target.style.display = "none";
            }
        }
        
        // Expose public methods
        return {
            switchLanguage,
            checkPassword,
            openAddModal,
            closeAddModal,
            saveNewCourse,
            deleteCourse,
            toggleMobileMenu
        };
    }

    return init();
})();
