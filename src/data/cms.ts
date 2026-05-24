export interface I18nText {
  EN: string;
  ZH: string;
  PIRATE?: string;
}

export interface DeptConfig {
  name: I18nText;
  light: string;
  textLight: string;
  dark: string;
  textDark: string;
  shape: string;
}

export interface HeroItem {
  id: string;
  type: 'hero';
  title: I18nText;
  label: I18nText;
  desc: I18nText;
  colorLight: string;
  textLight: string;
  colorDark: string;
  textDark: string;
  image: string;
}

export interface EventItem {
  id: string;
  type: 'event';
  title: I18nText;
  desc: I18nText;
  date: string;
  colorLight: string;
  textLight: string;
  colorDark: string;
  textDark: string;
  image: string;
}

export interface MemberItem {
  id: string;
  type: 'member';
  name: string;
  gen: string;
  role: I18nText;
  class: string;
  dept: string;
  about: I18nText;
  expectation: I18nText;
  responsibility: I18nText;
  seed: number;
  image: string;
}

export interface CMSData {
  hero: HeroItem;
  events: EventItem[];
  members: MemberItem[];
}

export const DEPTS: Record<string, DeptConfig> = {
  "Presidential": { name: { EN: "Presidential", ZH: "學生會代表" }, light: "#D7E3FF", textLight: "#001B3F", dark: "#0056B3", textDark: "#E0EAFF", shape: "squircle" },
  "Activities": { name: { EN: "Activities", ZH: "活動部" }, light: "#FFD9E2", textLight: "#3A002A", dark: "#AD1468", textDark: "#FFD9E4", shape: "cookie" },
  "Sec & Treas": { name: { EN: "Sec & Treas", ZH: "秘書與總務部" }, light: "#EADDFF", textLight: "#2A0054", dark: "#7A35D6", textDark: "#EADDFF", shape: "8-leaf clover" },
  "Equipment": { name: { EN: "Equipment", ZH: "器材部" }, light: "#FFDBCC", textLight: "#331100", dark: "#A04500", textDark: "#FFDBCB", shape: "4-sided cookie" },
  "IT": { name: { EN: "IT", ZH: "資訊部" }, light: "#BCE9FF", textLight: "#001F29", dark: "#006785", textDark: "#BCE9FF", shape: "diamond" },
  "PR": { name: { EN: "PR", ZH: "公關部" }, light: "#A5F5B2", textLight: "#002107", dark: "#007030", textDark: "#A9F5B5", shape: "flower" },
  "Student Rights": { name: { EN: "Student Rights", ZH: "學權部" }, light: "#FFDAD6", textLight: "#410002", dark: "#B80010", textDark: "#FFDAD6", shape: "burst" },
};

export const CMS: CMSData = {
  hero: {
    id: "hero", type: "hero",
    title: { EN: "The 8th Council Transition", ZH: "第八屆學生會傳承與交接" },
    label: { EN: "ANNOUNCEMENT", ZH: "最新公告" },
    desc: { EN: "Welcome to the new era of KCISLK Student Council. We are committed to bridging voices, innovating events, and serving our community with excellence and a vital bridge between students and faculty.", ZH: "歡迎踏進康橋國際學校林口校區學生會的新時代。我們致力於傾聽學生聲音、創新校園活動，並以卓越的服務回饋社區、成為學生與師長的一座橋樑。" },
    colorLight: "#D8E2FF", textLight: "#001A41", colorDark: "#002D6D", textDark: "#ADC6FF",
    image: ""
  },
  events: [
    { id: "ev-1", type: "event", title: { EN: "End of Year Prom", ZH: "林口康橋年末舞會" }, desc: { EN: "An chaotic evening for students to celebrate the end of the academic year with music, dancing, and lasting memories.", ZH: "專屬學生的狂歡晚會，透過音樂與舞蹈慶祝學年結束並創造美好回憶。" }, date: "MAY 24", colorLight: "#E8DEF8", textLight: "#1D192B", colorDark: "#4A4458", textDark: "#E8DEF8", image: "" },
    { id: "ev-2", type: "event", title: { EN: "KCISLK Voice Contest", ZH: "康橋好聲音" }, desc: { EN: "A school-wide singing competition showcasing students' vocal talents and musical performances.", ZH: "全校性的歌唱比賽，提供學生展現歌唱才華與勇氣自信的舞台。" }, date: "APR 12", colorLight: "#FFD9E2", textLight: "#3E001D", colorDark: "#631133", textDark: "#FFD9E2", image: "" },
    { id: "ev-3", type: "event", title: { EN: "Secondary School Interclass Basketball Tournament", ZH: "中學部班際籃球比賽" }, desc: { EN: "A competitive basketball tournament to foster class unity, sportsmanship, and athletic excellence across the secondary school.", ZH: "促進班級凝聚力、運動家精神與體育交流的中學部籃球賽事。" }, date: "MAR 10", colorLight: "#FFDCBE", textLight: "#2C1600", colorDark: "#4A2800", textDark: "#FFDCBE", image: "" },
    { id: "ev-4", type: "event", title: { EN: "Mother’s day", ZH: "母親節活動" }, desc: { EN: "Special activities dedicated to expressing gratitude and celebrating mothers within our daily life.", ZH: "專為表達感恩之情所舉辦的特別活動，慶祝並感謝生活中的母親們。" }, date: "MAY 10", colorLight: "#FCE7F3", textLight: "#4E082A", colorDark: "#710B3B", textDark: "#FCE7F3", image: "" },
    { id: "ev-5", type: "event", title: { EN: "Denim Day", ZH: "丹寧日" }, desc: { EN: "A designated day where students wear denim to raise awareness for sexual assault prevention and show support for survivors.", ZH: "鼓勵學生穿著丹寧服飾的響應日，提升對性侵防治的意識並聲援受害者。" }, date: "APR 24", colorLight: "#C2E7FF", textLight: "#001D35", colorDark: "#003458", textDark: "#C2E7FF", image: "" },
    { id: "ev-6", type: "event", title: { EN: "Voice & Vision Assembly", ZH: "學生大會" }, desc: { EN: "Student Council assembly to discuss student rights and gather students’ feedback.", ZH: "學生會與學生代表集會，討論學生權益並收集意見。" }, date: "OCT 05", colorLight: "#E0E7FF", textLight: "#1E1B4B", colorDark: "#2C2C6A", textDark: "#E0E7FF", image: "" },
  ],
  members: [
    { id: "mem-p1", type: "member", name: "Noah Dok 曾子銘", gen: "7th", role: { EN: "President", ZH: "會長" }, class: "11E", dept: "Presidential", about: { EN: "I balance school life with playing basketball and taking photos, and often find inspiration in social issues and family travels.", ZH: "在忙碌的校園生活之餘，我喜歡透過拍照、聽音樂和打籃球來切換心情。我對社會議題有濃厚好奇心。" }, expectation: { EN: "My goal is a campus where everyone feels at home. I'm here to improve our school life.", ZH: "我希望能強化校園的凝聚力，讓每位同學在康橋都能找到歸屬感。" }, responsibility: { EN: "As President, I lead all departments in organizing school events and facilitate cross-departmental communication.", ZH: "身為學生會長，我的職責是統籌各項學生會舉辦的全校性活動，並協調部會間的溝通與合作。" }, seed: 101, image: "/photos/Photo 2/Leadership/Noah Dok _ 曾子銘.png" },
    { id: "mem-p2", type: "member", name: "Alex Yang 楊子毅", gen: "8th", role: { EN: "President", ZH: "會長" }, class: "10E", dept: "Presidential", about: { EN: "I'm a lively, cheerful, and outgoing person! I love cycling and playing basketball.", ZH: "我是一個活潑開朗、外向的人！我平時很愛騎車、打籃球。" }, expectation: { EN: "I hope to make good use of this semester to successfully hand over the reins, making the council more cohesive.", ZH: "我希望我能夠利用這學期好好的與學長姐們完成交接，讓學生會變得更有凝聚力。" }, responsibility: { EN: "My responsibility is to ensure that the major events each year are completed on time and run smoothly.", ZH: "我的任務就是確保各年度的大活動準時且順利的完成，並帶領各部門。" }, seed: 102, image: "/photos/Photo 2/Leadership/Alex Yang _ 楊子毅.png" },
    { id: "mem-p3", type: "member", name: "Richard 安禹丞", gen: "7th", role: { EN: "Vice President", ZH: "副會長" }, class: "11D", dept: "Presidential", about: { EN: "In my spare time I try to read as much as possible, mainly literature and film.", ZH: "在閒暇時間，我盡量多閱讀，主要對文學和電影感興趣。我重視一致性與守時。" }, expectation: { EN: "To create an environment where academic achievements are valued, and school traditions are passed down.", ZH: "營造一個重視學術成就的環境，並讓學校的傳統得以傳承與延續。" }, responsibility: { EN: "Leading different departments and organizing school-wide events.", ZH: "職責包括領導各個部門以及籌辦全校性活動。代表學生出席學校會議。" }, seed: 103, image: "/photos/Photo 2/Leadership/Richard Ayres _  安禹丞.png" },
    { id: "mem-p4", type: "member", name: "Sammi Huang 黃鈺珊", gen: "8th", role: { EN: "Vice President", ZH: "副會長" }, class: "10B", dept: "Presidential", about: { EN: "I really enjoy chatting with others. When it comes to my studies and responsibilities, I treat them very seriously.", ZH: "我平常很喜歡跟別人聊天。在學業以及每一件我負責的事情上，我都還是會非常認真對待的！" }, expectation: { EN: "I hope we can maintain a relaxed and trusting environment where people feel comfortable sharing ideas.", ZH: "我希望學生會內部可以有很良好的團隊氣氛，保持輕鬆與信任的關係。" }, responsibility: { EN: "Assist the president in managing departments, helping ensure work runs smoothly.", ZH: "協助會長一起管理學生會各部門的運作，確保每個部門的工作都能順利進行。" }, seed: 104, image: "/photos/Photo 2/Leadership/Sammi Huang _ 黃鈺珊.png" },
    { id: "mem-a1", type: "member", name: "Candice Wu 吳家萱", gen: "7th", role: { EN: "Activities Dir", ZH: "活動部長" }, class: "11D", dept: "Activities", about: { EN: "I am a responsible person who loves sports, especially cycling and surfing.", ZH: "我是一個有責任感的人。我熱愛運動，其中最喜歡騎車跟衝浪。" }, expectation: { EN: "Organize more fun and meaningful events so everyone can participate.", ZH: "希望能舉辦更多有趣又有意義的活動，為校園生活留下美好回憶。" }, responsibility: { EN: "Planning all events, from designing content to managing the event day.", ZH: "負責規劃學生會各類活動，從內容設計到流程安排及當天執行。" }, seed: 201, image: "/photos/Photo 2/Activities/Candice Wu _ 吳家萱.png" },
    { id: "mem-a2", type: "member", name: "Nina Huang 黃子秦", gen: "8th", role: { EN: "Activities Dir", ZH: "活動部長" }, class: "10C", dept: "Activities", about: { EN: "I enjoy watching movies, listening to music, and planning my schedule in advance.", ZH: "我平時喜歡看電影，聽音樂，還有睡覺。習慣提早規劃好日程。" }, expectation: { EN: "Plan diverse and interesting events, encouraging more students to participate.", ZH: "規劃並舉辦多元有趣的活動，讓更多同學願意參與。" }, responsibility: { EN: "Planning and coordinating events, ensuring they run smoothly.", ZH: "主要負責規劃和統籌各項活動，確保活動順利進行。" }, seed: 202, image: "/photos/Photo 2/Activities/Nina Huang _ 黃子秦.png" },
    { id: "mem-a3", type: "member", name: "Mick Wen 溫奕閔", gen: "7th", role: { EN: "Activities VP", ZH: "活動副部長" }, class: "11D", dept: "Activities", about: { EN: "I am easygoing. I enjoy watching videos, listening to music, and talking with friends.", ZH: "我是一個個性隨和的人，平常喜歡看影片聽音樂，也喜歡和朋友聊天。" }, expectation: { EN: "Organize interesting and meaningful events to create good memories.", ZH: "規劃更多有趣且有意義的活動，讓大家在校園生活中留下美好回憶。" }, responsibility: { EN: "Work with the team to prepare and carry out activities.", ZH: "配合團隊一起完成活動的準備與執行，和組員保持良好溝通。" }, seed: 203, image: "/photos/Photo 2/Activities/Mick Wen _ 溫奕閔.png" },
    { id: "mem-a4", type: "member", name: "Sophia Shih 施可馨", gen: "8th", role: { EN: "Activities VP", ZH: "活動副部長" }, class: "10C", dept: "Activities", about: { EN: "I enjoy dancing, listening to music, and watching movies. I am careful and responsible.", ZH: "平常喜歡跳舞，聽音樂，看電影。我做事細心謹慎、負責任。" }, expectation: { EN: "Enrich school life and increase student participation.", ZH: "希望能豐富學校的生活和學生的參與率，往創新多元化方向發展。" }, responsibility: { EN: "Managing progress and maintaining effective communication with team members.", ZH: "負責進度管理，和內部組員及其他部門有效的溝通。" }, seed: 204, image: "/photos/Photo 2/Activities/Sophia Shih _ 施可馨.png" },
    { id: "mem-a5", type: "member", name: "Patrick Cheng 程柏諺", gen: "7th", role: { EN: "Advisor", ZH: "活動顧問" }, class: "11C", dept: "Activities", about: { EN: "I enjoy racing and go-karting. My working style is direct and efficient.", ZH: "我很喜歡賽車、卡丁車。我的做事風格比較偏向直接、有效率。" }, expectation: { EN: "I hope all activities run smoothly and add more color to school life.", ZH: "希望所有活動順利進行，為大家的生活增添更多色彩。" }, responsibility: { EN: "Pass on experiences from past events and provide advice.", ZH: "傳承過去舉辦活動的經驗，在需要幫忙時提供建議與協助。" }, seed: 205, image: "https://ui-avatars.com/api/?name=Patrick&background=random&color=fff&size=512&bold=true" },
    { id: "mem-s1", type: "member", name: "Alex 林才正", gen: "7th", role: { EN: "Secretary", ZH: "秘書" }, class: "11B", dept: "Sec & Treas", about: { EN: "I enjoy playing instruments, basketball, and drawing. I like exploring the logic of everything.", ZH: "平時喜歡玩樂器、打籃球、畫畫。喜歡探索世界的現象與了解底層邏輯。" }, expectation: { EN: "Create an environment that values character and moral values.", ZH: "期望營造一個重視品德與品格的學校，引領學生探索志向。" }, responsibility: { EN: "Recording meetings, handling paperwork, and acting as a bridge between departments.", ZH: "記錄會議、文書工作以及各部門溝通的橋樑。" }, seed: 301, image: "/photos/Photo 2/Administrative & Financial/Alex _ 林才正.png" },
    { id: "mem-s2", type: "member", name: "Hsu Hao-Cheng 許浩晟", gen: "8th", role: { EN: "Secretary", ZH: "秘書" }, class: "10D", dept: "Sec & Treas", about: { EN: "I have a strong passion for administrative work. I enjoy reading and staying active.", ZH: "熱衷於行政類型的工作，平時興趣是聽音樂看書，假日也常去運動。" }, expectation: { EN: "Facilitate smoother discussions to optimize workflow.", ZH: "幫助各組討論的進程，讓運作更順利，擴大學生影響力。" }, responsibility: { EN: "Preparing agendas, maintaining minutes, and coordinating venues.", ZH: "負責開會資料與紀錄，規畫場地，並與各部門合作監督運行。" }, seed: 302, image: "/photos/Photo 2/Administrative & Financial/Hsu Hao-Cheng _ 許浩晟.png" },
    { id: "mem-s3", type: "member", name: "Justin Yeh 葉哲綸", gen: "7th", role: { EN: "General Admin", ZH: "總務" }, class: "11E", dept: "Sec & Treas", about: { EN: "I enjoy racket sports, baseball, and Classical music.", ZH: "平常我對運動、飛行、還有古典樂都很有興趣。" }, expectation: { EN: "Ensure every expense is clearly recorded and used responsibly.", ZH: "讓學生會的每一筆經費都能被清楚記錄、合理使用。" }, responsibility: { EN: "Preparing the annual budget and handling reimbursement processes.", ZH: "編列學年活動預算，以及處理各部門支出的報帳流程。" }, seed: 303, image: "/photos/Photo 2/Administrative & Financial/Justin Yeh _ 葉哲綸.png" },
    { id: "mem-s4", type: "member", name: "Mina Liu 劉敏誼", gen: "8th", role: { EN: "Treasurer Dir", ZH: "總務部長" }, class: "10A", dept: "Sec & Treas", about: { EN: "I love music and solving math problems. I'm cheerful but focused when needed.", ZH: "興趣是唱歌和聽音樂，空閒時喜歡做數學題。個性活潑但也認真負責。" }, expectation: { EN: "Help make school activities run more smoothly and become meaningful.", ZH: "期待能和大家合作，透過努力讓學校的活動更加順利、有意義。" }, responsibility: { EN: "Manage finances, track expenses, organize receipts for reimbursement.", ZH: "管理經費，追蹤支出並整理發票報帳，確保經費使用清楚。" }, seed: 304, image: "/photos/Photo 2/Administrative & Financial/Mina Liu _ 劉敏誼.png" },
    { id: "mem-e1", type: "member", name: "Jack Huang 黃冠傑", gen: "7th", role: { EN: "Equipment Dir", ZH: "器材部長" }, class: "11E", dept: "Equipment", about: { EN: "Responsible person who enjoys helping others, playing basketball and video games.", ZH: "做事有責任感且樂於助人。平時喜歡打球、練琴和玩電動。" }, expectation: { EN: "Elevate the quality of activities and increase student participation.", ZH: "讓活動的品質提高，增加學生參與活動的意願。" }, responsibility: { EN: "Planning event layouts, preparing equipment, and managing venue setup.", ZH: "負責活動場佈圖規劃、準備器材及場地布置。" }, seed: 401, image: "/photos/Photo 2/Equipment/Jack Huang _ 黃冠傑.png" },
    { id: "mem-e2", type: "member", name: "Cheng-Tai 吳承泰", gen: "8th", role: { EN: "Equipment Dir", ZH: "器材部長" }, class: "10D", dept: "Equipment", about: { EN: "I am responsible and love sports, especially triathlons, running, and cycling.", ZH: "負責任的人，熱愛運動，最喜歡鐵人三項。假日會去跑步或騎車。" }, expectation: { EN: "Increase students' willingness to participate and make activities better.", ZH: "增加學生參加活動的意願，讓活動辦的更好。" }, responsibility: { EN: "Planning venue layouts, preparing necessary equipment and setup.", ZH: "規劃場地配置圖、準備設備與場地佈置，並與各部門密切合作。" }, seed: 402, image: "/photos/Photo 2/Equipment/Cheng-Tai _ 吳承泰.png" },
    { id: "mem-e3", type: "member", name: "Jeremy Lee 李定謙", gen: "7th", role: { EN: "Equipment VP", ZH: "器材副部長" }, class: "1102", dept: "Equipment", about: { EN: "Helpful and easy-going. I enjoy guitar, basketball, and video games.", ZH: "熱於助人又隨和。平時喜歡彈吉他，打籃球和打電動。" }, expectation: { EN: "Improve the quality and enjoyment of school activities.", ZH: "讓學校活動的品質和趣味提升，並增加學生們的參與意願。" }, responsibility: { EN: "Assist in planning layouts and preparing equipment for events.", ZH: "輔助場佈圖規劃、準備活動所需器材及場地布置。" }, seed: 403, image: "/photos/Photo 2/Equipment/Jeremy Lee _ 李定謙.png" },
    { id: "mem-e4", type: "member", name: "Pan Wei-Yu 潘威佑", gen: "8th", role: { EN: "Equipment VP", ZH: "器材副部長" }, class: "10D", dept: "Equipment", about: { EN: "I'm talkative, lively, and love triathlons and trying new things.", ZH: "話很多、很活潑的人。喜歡運動和鐵人三項，也愛嘗試新東西。" }, expectation: { EN: "Ensure everyone enjoys the activities through our arrangements.", ZH: "希望能透過器材部的努力和佈置，讓大家更喜歡辦的活動。" }, responsibility: { EN: "Assist the leader in planning venue layouts and preparing setups.", ZH: "主要輔助規劃場地配置圖、準備設備與佈置，並確保跨部門合作。" }, seed: 404, image: "/photos/Photo 2/Equipment/Pan Wei-Yu _ 潘威佑.png" },
    { id: "mem-i1", type: "member", name: "Andrew Chang 張安卓", gen: "7th", role: { EN: "IT Dir", ZH: "資訊部長" }, class: "11C", dept: "IT", about: { EN: "I really really like electronics :3 Enjoy challenging myself with cool projects.", ZH: "我喜歡電腦:3 在這裡做挑戰自己的酷東西。" }, expectation: { EN: "Ensure all systems and server operation, deploy resources.", ZH: "確保所有系統與伺服器正常運作，部署並編制人力與技術資源。" }, responsibility: { EN: "System stability and website infrastructure.", ZH: "系統穩定與網站架設。" }, seed: 501, image: "/photos/Photo 2/IT/Andrew Chang _ 張安卓.png" },
    { id: "mem-i2", type: "member", name: "William 張政崴", gen: "8th", role: { EN: "IT Dir", ZH: "資訊部長" }, class: "10A", dept: "IT", about: { EN: "Positive and determined. I love sports and experiencing the world.", ZH: "樂觀、有毅力的人。平時喜歡運動、打球、出去體驗不同特色。" }, expectation: { EN: "Help students and teachers connect with vital information effectively.", ZH: "希望能學習資科知識，並確保學生和師長能輕易接觸所有資訊。" }, responsibility: { EN: "Maintain effectiveness of public information and website development.", ZH: "維持對外資訊的正確性和即時性，包含網站架設與資料儲存。" }, seed: 502, image: "/photos/Photo 2/IT/William _ 張政崴.png" },
    { id: "mem-i3", type: "member", name: "Vanessa Liu 劉蘊儀", gen: "7th", role: { EN: "IT VP", ZH: "資訊副部長" }, class: "11C", dept: "IT", about: { EN: "An art student interested in everything. I love to dress like a male <3", ZH: "是藝術人，但對所有事情都有興趣。我喜歡穿男裝。" }, expectation: { EN: "Gain a wide range of new experiences through the council.", ZH: "希望透過在學生會的活動學習不同的東西。" }, responsibility: { EN: "Take responsibility for tasks and support team members' growth.", ZH: "各種大大小小的事情都會盡力負責，全力支持組員發展！" }, seed: 503, image: "/photos/Photo 2/IT/Vanessa Liu _ 劉蘊儀.png" },
    { id: "mem-i4", type: "member", name: "Kevin Tsai 蔡奕勝", gen: "8th", role: { EN: "IT VP", ZH: "資訊副部長" }, class: "10C", dept: "IT", about: { EN: "Passionate about sports like basketball, golf, and cycling.", ZH: "熱衷運動，會打籃球、高爾夫和騎車。正式場合一定會全力以赴！" }, expectation: { EN: "Learn IT skills from seniors and assist the team leader well.", ZH: "利用這學期學習資訊技能，做好該做的事，好好輔佐組長。" }, responsibility: { EN: "Ensure smooth operation of the IT team and assist when needed.", ZH: "確保資訊組順暢運作，並且在需要幫助時提供協助！" }, seed: 504, image: "/photos/Photo 2/IT/截圖 2026-03-30 下午5.24.41.png" },
    { id: "mem-pr1", type: "member", name: "Vivian Lan 藍右庭", gen: "7th", role: { EN: "PR Dir", ZH: "公關部長" }, class: "11E", dept: "PR", about: { EN: "Steady working style. I enjoy art, especially clay, and love the ocean.", ZH: "做事風格穩定。喜歡美術創作，特別是陶土與黏土，也很喜歡海洋。" }, expectation: { EN: "Strengthen the connection between the student council and the school.", ZH: "讓活動被更多人看見，也讓學生會與全校有更好的連結。" }, responsibility: { EN: "Promoting activities through online and on-campus publicity.", ZH: "負責活動的宣傳與推廣，包含線上與實體宣傳工作。" }, seed: 601, image: "/photos/Photo 2/Public Relations/Vivian Lan _ 藍右庭.png" },
    { id: "mem-pr2", type: "member", name: "Emma Chou 周欣諭", gen: "8th", role: { EN: "PR Dir", ZH: "公關部長" }, class: "10E", dept: "PR", about: { EN: "Careful and pursue perfection. I love sketching and playing piano.", ZH: "做事謹慎、追求完美。平時喜歡畫素描和彈鋼琴來放鬆。" }, expectation: { EN: "Present information efficiently to encourage participation.", ZH: "將資訊和活動以有效率且吸引人的方式傳遞，使大家更多參與。" }, responsibility: { EN: "Organize resources and collaborate to promote information.", ZH: "整合資源，和其他部門合作，將資訊傳遞給師生。" }, seed: 602, image: "/photos/Photo 2/Public Relations/Emma Chou _ 周欣諭.png" },
    { id: "mem-pr3", type: "member", name: "Jacob Lien 連尚祈", gen: "7th", role: { EN: "PR VP", ZH: "公關副部長" }, class: "11A", dept: "PR", about: { EN: "Quiet but can be loud and random. I love art, music, and sports.", ZH: "表面安靜但有時古怪。喜歡冒險，嗜好包括藝術、音樂和運動。" }, expectation: { EN: "Foster a closer community through coordinated advertisements.", ZH: "透過合作與溝通創建宣傳，旨在促進學校內部更緊密的聯繫。" }, responsibility: { EN: "Coordinate with departments to ensure events are publicized in time.", ZH: "與其他部門協調確保活動能夠及時宣傳(社群媒體/海報)。" }, seed: 603, image: "/photos/Photo 2/Public Relations/Jacob Lien _ 連尚祈.png" },
    { id: "mem-pr4", type: "member", name: "Ken 劉坤益", gen: "8th", role: { EN: "PR VP", ZH: "公關副部長" }, class: "10A", dept: "PR", about: { EN: "I'm a guy full of energy and creativity.", ZH: "我認為我是一個活潑且充滿想像力的人。" }, expectation: { EN: "Help communicate between members and assist the leader.", ZH: "擔任溝通橋樑，減少交流問題，全力協助部長的工作。" }, responsibility: { EN: "Take care of members and ensure promotional work is done on time.", ZH: "協助管理組員，幫助完成海報，確保進度不落後且按時繳交。" }, seed: 604, image: "/photos/Photo 2/Public Relations/Ken _ 劉坤益.png" },
    { id: "mem-sr1", type: "member", name: "Thomas Liu 劉千豪", gen: "7th", role: { EN: "Rights Dir", ZH: "學權部長" }, class: "11D", dept: "Student Rights", about: { EN: "I dare to express opinions, listen well, and provide effective feedback.", ZH: "勇於發表自我觀點，能傾聽同學們的意見並有效的進行反饋。" }, expectation: { EN: "Relay genuine needs to the school to improve student life.", ZH: "對學校反饋學生真實的意見及需求，藉此來改善學校生活。" }, responsibility: { EN: "Act as a bridge to ensure clear communication between students and school.", ZH: "作為學生以及學校的溝通橋樑，確保清楚傳達雙方意思。" }, seed: 701, image: "/photos/Photo 2/Student Right/Thomas Liu _ 劉千豪.png" },
    { id: "mem-sr2", type: "member", name: "Shaine Liu 劉軒庭", gen: "8th", role: { EN: "Rights Dir", ZH: "學權部長" }, class: "10A", dept: "Student Rights", about: { EN: "I prefer to listen first, then reach consensus. I like anime and music.", ZH: "習慣先聆聽他人意見，再透過討論達成協議。喜歡動漫和聽音樂。" }, expectation: { EN: "Ensure concerns are heard and implemented to make campus supportive.", ZH: "讓意見被聽到並且落實改變，讓校園環境變得更加友善。" }, responsibility: { EN: "Draft proposals and negotiate with the school for positive changes.", ZH: "針對意見提出提案書，爭取權益，並透過溝通確定改變的落實。" }, seed: 702, image: "/photos/Photo 2/Student Right/Shaine Liu _ 劉軒庭.png" },
    { id: "mem-sr3", type: "member", name: "Liz 李希言", gen: "7th", role: { EN: "Rights VP", ZH: "學權副部長" }, class: "11B", dept: "Student Rights", about: { EN: "Try my best to complete tasks well. I enjoy listening to music to relax.", ZH: "盡力把事情做好，不給別人帶來負擔。平時喜歡聽音樂放鬆。" }, expectation: { EN: "Ensure voices are heard to bring a positive impact to our school.", ZH: "讓學生的聲音被聽見，也讓學生會為校園帶來更多正面影響。" }, responsibility: { EN: "Collect opinions, organize elections, and handle fundraising.", ZH: "蒐集意見反映給學校，並舉辦選舉與勸募活動。" }, seed: 703, image: "/photos/Photo 2/Student Right/Liz _ 李希言.png" },
    { id: "mem-sr4", type: "member", name: "Sabrina Wang 王湘穎", gen: "8th", role: { EN: "Rights VP", ZH: "學權副部長" }, class: "10E", dept: "Student Rights", about: { EN: "Diligent and helpful in communication. I enjoy reading and quiet activities.", ZH: "很活潑的人，能幫忙團隊溝通。興趣愛好是看小說，喜歡獨處。" }, expectation: { EN: "Improve students' rights and listen to everyone's opinions.", ZH: "優化學生的在校權益，聽取大家的意見，改善不好的地方。" }, responsibility: { EN: "Assist in proposals, elections, and collecting feedback for the school.", ZH: "輔助撰寫提案書、操辦選舉與勸募，並搜集大家的反饋。" }, seed: 704, image: "/photos/Photo 2/Student Right/Sabrina Wang _ 王湘穎.png" },
  ],
};
