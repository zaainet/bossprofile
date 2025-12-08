/**
 * assets/js/app.js
 * Mr.BossBaby Academy - Core Frontend JavaScript (i18n + Dynamic Courses + Admin CRUD)
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

    const DOM = {
        coursesList: document.getElementById('coursesList'),
        adminTrigger: document.getElementById('adminTrigger'),
        passwordModal: document.getElementById('passwordModal'),
        addCourseModal: document.getElementById('addCourseModal'),
        adminPanel: document.getElementById('adminPanel'),
        navLinks: document.getElementById('navLinks'),
        langBtn: document.getElementById('lang-toggle-btn')
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
        meta: { my: '<i class="fas fa-clock"></i> ၅-၇ လ | <i class="fas fa-certificate"></i> အသိအမှတ်ပြု လက်မှတ်', en: '<i class="fas fa-clock"></i> 5-7 Months | <i class="fas fa-certificate"></i> Certified' },
        desc: { my: "Website ရေးဆွဲခြင်း (HTML/CSS/Laravel) မှ Mobile App (Flutter) အထိ Full-Stack Developer တစ်ယောက်အဖြစ် အသက်မွေးဝမ်းကြောင်းပြုလိုသူများအတွက် အပြည့်စုံဆုံး သင်တန်း။", en: "The most comprehensive course for those who want to pursue a career as a Full-Stack Developer, covering Website development (HTML/CSS/Laravel) to Mobile App (Flutter)." },
        tags: [{my: "HTML/CSS/JS", en: "HTML/CSS/JS"}, {my: "PHP Laravel", en: "PHP Laravel"}, {my: "Flutter", en: "Flutter"}, {my: "လက်တွေ့ Project များ", en: "Real Projects"}],
        price: "150,000 Ks",
        oldPrice: "220,000 Ks"
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
                fetch('lang/mm.json').then(res => res.json()),
                fetch('lang/eng.json').then(res => res.json())
            ]);
            state.i18n = { my: mm, en: en };
        } catch (error) {
            console.error("Error loading translations. Using hardcoded defaults.", error);
            // Fallback (for environments where JSON loading is restricted) - Use Code 1's basic keys as fallback
            state.i18n = {
                "my": { "nav_services": "ဝန်ဆောင်မှု", "nav_classes": "သင်တန်းများ", "enroll_now": "သင်တန်းအပ်ရန်", "admin_active": "[ ADMIN MODE ဖွင့်ထားသည် ]", "pass_auth": "စနစ်သို့ဝင်ရောက်မည်", "pass_input": "ဝင်ရောက်ခွင့်ကုတ်နံပါတ်", "modal_title_label": "သင်တန်းခေါင်းစဉ်", "modal_price_label": "ဈေးနှုန်း (ကျပ်)", "hero_quote": "\"နည်းပညာဆိုတာ လူသားတွေရဲ့ လက်နက်ဖြစ်တယ်။ အဲ့ဒီလက်နက်ကို ဘယ်လို စနစ်တကျ၊ လုံခြုံစွာ ကိုင်တွယ်မလဲဆိုတာ ကျွန်တော်တို့ သင်ကြားပေးနေပါတယ်။\"" },
                "en": { "nav_services": "Services", "nav_classes": "Classes", "enroll_now": "Enroll Now", "admin_active": "[ ADMIN MODE ACTIVE ]", "pass_auth": "AUTHENTICATE", "pass_input": "Enter Access Code", "modal_title_label": "Course Title", "modal_price_label": "Price (Ks)", "hero_quote": "\"Technology is humanity's weapon. We teach how to handle that weapon systematically and securely.\"" }
            };
        }
    }

    function translateText() {
        const langData = state.i18n[state.lang] || {};

        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            const translation = langData[key];
            if (translation) {
                if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                    element.placeholder = translation;
                } else {
                    element.textContent = translation;
                }
            }
        });
        
        // Handle specific elements
        document.getElementById('hero-quote').textContent = langData.hero_quote;
        document.getElementById('adminPass').placeholder = langData.pass_input;

        // Update Language Button
        DOM.langBtn.textContent = langData.lang_switch;
        DOM.langBtn.style.fontFamily = state.lang === 'my' ? "'Padauk', sans-serif" : "'Poppins', sans-serif";

        // Re-render dynamic content (courses)
        renderCourses();
    }

    function switchLanguage() {
        state.lang = state.lang === 'my' ? 'en' : 'my';
        document.documentElement.lang = state.lang;
        translateText();
    }

    /* -----------------------------------------
       Course Rendering (CRUD R)
    ----------------------------------------- */
    function renderCourses() {
        const container = DOM.coursesList;
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
        // Triple-click mechanism to open password modal
        DOM.adminTrigger.addEventListener('click', (e) => {
            e.preventDefault(); 
            clickCount++;
            
            clearTimeout(clickTimer);
            
            if (clickCount === 3) {
                DOM.passwordModal.style.display = 'block';
                document.getElementById('adminPass').focus();
                clickCount = 0; // Reset after trigger
            } else {
                clickTimer = setTimeout(() => {
                    clickCount = 0; 
                }, 500);
            }
        });
    }

    function checkPassword() {
        const pass = document.getElementById('adminPass').value;
        if (pass === state.ADMIN_PASSWORD) {
            activateAdminMode();
            DOM.passwordModal.style.display = 'none';
            document.getElementById('adminPass').value = '';
        } else {
            alert(state.lang === 'my' ? 'လျှို့ဝှက်ကုတ်နံပါတ် မှားယွင်းနေပါသည်။' : 'ACCESS DENIED: Incorrect Protocol.');
            DOM.passwordModal.style.display = 'none';
        }
    }

    function activateAdminMode() {
        state.isAdminMode = true;
        document.body.classList.add('admin-mode');
        DOM.adminPanel.classList.add('active');
        
        // Update trigger text to indicate mode
        DOM.adminTrigger.style.color = 'var(--neon-pink)';
        DOM.adminTrigger.textContent = DOM.adminTrigger.textContent.replace('🔓', '') + ' 🔓'; 
        
        renderCourses();
        console.log("Admin Mode Activated.");
    }

    function openAddModal() {
        if (!state.isAdminMode) return;
        DOM.addCourseModal.style.display = 'block';
    }

    function closeAddModal() {
        DOM.addCourseModal.style.display = 'none';
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
        document.getElementById('newImg').value = "https://placehold.co/600x400/000000/00ffc6?text=New+Class";
    }

    function deleteCourse(index) {
        if (!state.isAdminMode) return;
        if(confirm(state.lang === 'my' ? "ဒီသင်တန်းကို ဖျက်ချင်တာ သေချာပါသလား။" : "Are you sure you want to delete this course?")) {
            state.courses.splice(index, 1);
            saveToStorage();
            renderCourses();
        }
    }

    function toggleMobileMenu() {
        DOM.navLinks.classList.toggle('active');
    }

    /* -----------------------------------------
       Initialization
    ----------------------------------------- */
    async function init() {
        loadCourses(); // Load existing or default courses
        await loadTranslations(); // Load i18n data
        translateText(); // Apply translations and render courses
        setupAdminMode(); // Setup the admin access trigger

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
