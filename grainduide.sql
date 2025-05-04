--
-- PostgreSQL database dump
--

-- Dumped from database version 17.2
-- Dumped by pg_dump version 17.2

-- Started on 2025-05-04 01:08:09

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 218 (class 1259 OID 17541)
-- Name: film_stocks; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.film_stocks (
    id integer NOT NULL,
    name text NOT NULL,
    brand text NOT NULL,
    format text[] NOT NULL,
    iso integer NOT NULL,
    color boolean NOT NULL,
    contrast text,
    grain text,
    description text,
    image_url text,
    example_images text,
    CONSTRAINT film_stocks_contrast_check CHECK ((contrast = ANY (ARRAY['low'::text, 'medium'::text, 'high'::text]))),
    CONSTRAINT film_stocks_grain_check CHECK ((grain = ANY (ARRAY['fine'::text, 'medium'::text, 'heavy'::text, 'ultra fine'::text, 'variable'::text])))
);


ALTER TABLE public.film_stocks OWNER TO postgres;

--
-- TOC entry 217 (class 1259 OID 17540)
-- Name: film_stocks_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.film_stocks_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.film_stocks_id_seq OWNER TO postgres;

--
-- TOC entry 4815 (class 0 OID 0)
-- Dependencies: 217
-- Name: film_stocks_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.film_stocks_id_seq OWNED BY public.film_stocks.id;


--
-- TOC entry 220 (class 1259 OID 17554)
-- Name: recommendations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.recommendations (
    id integer NOT NULL,
    answer_combination text NOT NULL,
    film_stock_1 integer,
    film_stock_2 integer,
    film_stock_3 integer
);


ALTER TABLE public.recommendations OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 17553)
-- Name: recommendations_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.recommendations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.recommendations_id_seq OWNER TO postgres;

--
-- TOC entry 4816 (class 0 OID 0)
-- Dependencies: 219
-- Name: recommendations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.recommendations_id_seq OWNED BY public.recommendations.id;


--
-- TOC entry 4646 (class 2604 OID 17544)
-- Name: film_stocks id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.film_stocks ALTER COLUMN id SET DEFAULT nextval('public.film_stocks_id_seq'::regclass);


--
-- TOC entry 4647 (class 2604 OID 17557)
-- Name: recommendations id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.recommendations ALTER COLUMN id SET DEFAULT nextval('public.recommendations_id_seq'::regclass);


--
-- TOC entry 4807 (class 0 OID 17541)
-- Dependencies: 218
-- Data for Name: film_stocks; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.film_stocks (id, name, brand, format, iso, color, contrast, grain, description, image_url, example_images) FROM stdin;
1	Kodak Portra 160	Kodak	{35mm,120,"Large Format (4x5)","Large Format (8x10)"}	160	t	low	fine	Kodak Portra 160 is a daylight-balanced color negative film (ISO 160) optimized for portrait and studio work. It features exceptionally fine grain, low contrast, and neutral color rendering, making it ideal for skin tones and controlled lighting. With wide exposure latitude and smooth tonal transitions, it performs best in bright or diffused light. Its subtle, balanced tones give images a clean, natural look with a touch of softness, making it a favorite for medium and large format shooters seeking a refined, modern aesthetic.	\N	\N
2	Kodak Portra 400	Kodak	{35mm,120,"Large Format (4x5)","Large Format (8x10)"}	400	t	medium	fine	Kodak Portra 400 is a versatile, daylight-balanced color negative film with an ISO of 400. It offers a balanced mix of fine grain, medium contrast, and natural color rendering, especially in skin tones. Its wide exposure latitude allows for flexibility in both natural and mixed lighting conditions, making it a reliable choice for portraits, street photography, and travel. Portra 400 handles overexposure gracefully and maintains detail across shadows and highlights, delivering a warm, soft look with a modern feel.	\N	\N
3	Kodak Portra 800	Kodak	{35mm,120}	800	t	medium	fine	Kodak Portra 800 is a high-speed, daylight-balanced color negative film with an ISO of 800. It offers medium grain, moderate contrast, and accurate color reproduction, especially in low light or indoor environments. With wide exposure latitude and excellent shadow detail, it is well suited for evening portraits, event photography, and mixed lighting scenarios. Portra 800 retains the signature Portra look while providing the flexibility to shoot handheld in challenging conditions without sacrificing image quality.	\N	\N
4	Kodak Ektar 100	Kodak	{35mm,120,"Large Format (4x5)","Large Format (8x10)"}	100	t	high	fine	Kodak Ektar 100 is a daylight-balanced color negative film with an ISO of 100, known for its ultra-vivid color saturation and extremely fine grain. It produces high contrast and sharp detail, making it ideal for landscapes, travel, and nature photography. Ektar excels in bright lighting and is favored by photographers who want bold, punchy colors with a modern, polished look. Its crisp rendering and clean tones also make it suitable for commercial and editorial work where precision matters.	\N	\N
5	Kodak Tri-X 400	Kodak	{35mm,120,"Large Format (4x5)","Large Format (8x10)"}	400	f	high	medium	Kodak Tri-X 400 is a classic black and white negative film with an ISO of 400, prized for its distinctive grain structure, high contrast, and tonal depth. It performs well in a wide range of lighting conditions and responds beautifully to push processing, making it a favorite for street, documentary, and portrait work. With a gritty, timeless look and strong shadow detail, Tri-X 400 offers creative flexibility and a signature aesthetic that has defined generations of film photography.	\N	\N
6	Kodak T-MAX 3200	Kodak	{35mm}	3200	f	high	heavy	Kodak T-MAX 3200 is an ultra high-speed black and white negative film with a nominal ISO of 3200, designed for extreme low-light conditions. It features a distinctive T-Grain emulsion that delivers surprisingly fine grain for its speed, along with smooth tonal transitions and strong shadow detail. Ideal for night photography, concerts, or indoor scenes without flash, T-MAX 3200 offers flexibility for handheld shooting and push processing while maintaining a modern, clean look.	\N	\N
7	Kodak T-MAX P3200	Kodak	{35mm}	3200	f	high	heavy	Kodak T-MAX P3200 is a high-speed black and white negative film optimized for low-light and fast-action photography. While it has a nominal ISO of 800, it is designed to be push processed up to ISO 3200 and beyond. Its T-Grain emulsion produces relatively fine grain for its speed, along with smooth tones and high shadow detail. P3200 is ideal for handheld shooting in available light, offering a flexible and modern aesthetic for night scenes, concerts, and documentary work.	\N	\N
8	Fujifilm Pro 400H	Fujifilm	{35mm,120}	400	t	medium	fine	Fujifilm Pro 400H is a professional-grade, daylight-balanced color negative film with an ISO of 400, known for its soft contrast and natural, cool-toned color palette. It features fine grain, wide dynamic range, and gentle tonal transitions, making it especially well suited for portrait, wedding, and fashion photography. Pro 400H handles overexposure gracefully and excels in bright or diffused lighting, delivering a clean, airy look with subtle pastels and accurate skin tones.	\N	\N
9	Fujifilm Provia 100F	Fujifilm	{35mm,120,"Large Format (4x5)","Large Format (8x10)"}	100	t	high	fine	Fujifilm Provia 100F is a daylight-balanced color reversal (slide) film with an ISO of 100, known for its fine grain, high sharpness, and natural color reproduction. It offers medium contrast and excellent tonal precision, making it ideal for landscapes, architecture, and product photography. Provia performs best in controlled or bright lighting and delivers clean, vibrant images with neutral-to-cool tones and rich detail. Its consistency and professional quality make it a staple among slide film shooters.	\N	\N
10	Fujifilm Acros 100 II	Fujifilm	{35mm,120,"Large Format (4x5)","Large Format (8x10)"}	100	f	medium	fine	Fujifilm Acros 100 II is a black and white negative film with an ISO of 100, known for its extremely fine grain, high sharpness, and smooth tonal gradation. It features low contrast and excellent detail retention, making it well suited for landscapes, architecture, and studio work. Acros 100 II handles long exposures with minimal reciprocity failure and delivers a clean, modern look with deep blacks and soft highlights.	\N	\N
11	Fujifilm Velvia 50	Fujifilm	{35mm,120,"Large Format (4x5)","Large Format (8x10)"}	50	t	high	fine	Fujifilm Velvia 50 is a daylight-balanced color reversal (slide) film with an ISO of 50, renowned for its ultra-high color saturation, fine grain, and crisp detail. It produces deep contrast and vivid tones, especially in reds and greens, making it a favorite for landscape, nature, and travel photography. Velvia 50 performs best in bright, natural light and offers a bold, punchy look that emphasizes drama and intensity in every frame.	\N	\N
12	Ilford HP5 Plus	Ilford	{35mm,120,"Large Format (4x5)","Large Format (8x10)"}	400	f	medium	medium	Ilford HP5 Plus is a classic black and white negative film with an ISO of 400, known for its medium grain, wide exposure latitude, and flexible contrast. It performs reliably in a variety of lighting conditions and responds well to push processing, making it a popular choice for street, documentary, and general-purpose photography. HP5 Plus delivers rich blacks, bright highlights, and a slightly gritty texture that gives images a timeless, expressive character.	\N	\N
13	Ilford Delta 3200	Ilford	{35mm,120,"Large Format (4x5)","Large Format (8x10)"}	3200	f	medium	heavy	Ilford Delta 3200 is an ultra high-speed black and white negative film with a nominal ISO of 1000, designed to be push processed up to ISO 3200 and beyond. It features a tabular-grain emulsion that delivers a unique combination of pronounced grain, wide latitude, and strong shadow detail. Ideal for low-light, handheld shooting, it excels in night scenes, concerts, and indoor environments where flash is not an option. Delta 3200 produces a moody, atmospheric look with bold contrast and texture.	\N	\N
14	Ilford FP4 Plus	Ilford	{35mm,120,"Large Format (4x5)","Large Format (8x10)"}	125	f	medium	fine	Ilford FP4 Plus is a fine-grain black and white negative film with an ISO of 125, known for its exceptional sharpness, medium contrast, and wide tonal range. It performs best in bright or controlled lighting and is well suited for studio, landscape, and architectural photography. FP4 Plus delivers clean highlights, detailed shadows, and a classic, refined look that responds beautifully to traditional darkroom techniques and careful exposure.	\N	\N
15	Ilford Pan F Plus	Ilford	{35mm,120,"Large Format (4x5)","Large Format (8x10)"}	50	f	high	ultra fine	Ilford Pan F Plus is an ultra-low ISO black and white negative film rated at ISO 50, prized for its extremely fine grain, high resolution, and rich tonal detail. It delivers sharp, contrasty images with deep blacks and bright highlights, making it ideal for studio work, still life, and high-precision photography. Pan F Plus performs best in bright lighting and offers a crisp, classic aesthetic that holds up beautifully in large prints and fine art applications.	\N	\N
16	Cinestill 50D	Cinestill	{35mm,120}	50	t	medium	fine	CineStill 50D is a daylight-balanced color negative film with an ISO of 50, adapted from Kodak Vision3 50D motion picture film and modified for still photography. It offers extremely fine grain, high sharpness, and soft contrast with balanced, cinematic color rendering. Ideal for bright conditions, it excels in landscapes, portraits, and editorial work where clarity and color accuracy are key. Its clean highlights and subtle tones give images a polished, professional look with a distinctive motion picture feel.	\N	\N
17	Cinestill 800T	Cinestill	{35mm,120}	800	t	medium	medium	CineStill 800T is a tungsten-balanced color negative film with an ISO of 800, originally derived from Kodak Vision3 500T cinema film and engineered for still photography. It features medium grain, moderate contrast, and a distinctive color palette with cool tones and halation around highlights. Designed for low-light and artificial lighting, it excels in night scenes, urban environments, and moody interiors. CineStill 800T delivers a cinematic aesthetic with atmospheric color shifts and a unique glow that sets it apart from traditional films.	\N	\N
18	Lomography Color 400	Lomography	{35mm,120}	400	t	medium	medium	Lomography Color 400 is a color negative film with an ISO of 400, known for its bold saturation, noticeable grain, and playful color shifts. It produces warm tones, strong contrast, and unpredictable results that vary with lighting and exposure, making it a favorite for experimental, street, and casual photography. Color 400 performs well in daylight and mixed lighting, offering a fun, lo-fi aesthetic that embraces imperfection and creative expression.	\N	\N
19	Lomography Redscale	Lomography	{35mm,120,110}	50	t	high	variable	Lomography Redscale is a color negative film that is reverse-spooled to expose through its film base, creating dramatic red, orange, and yellow color shifts. With an ISO rating of 100 but flexible exposure from ISO 25 to 200, it offers heavy contrast, coarse grain, and intense warmth that varies based on metering and light conditions. Redscale is ideal for experimental and abstract photography, giving images a surreal, vintage atmosphere with fiery tones and strong mood.	\N	\N
20	Rollei Retro 80S	Rollei	{35mm,120}	80	f	high	fine	Rollei Retro 80S is a black and white negative film with an ISO of 80, featuring exceptionally fine grain, high sharpness, and extended red sensitivity. This near-infrared sensitivity enhances skies, foliage, and skin tones in unique ways, especially when used with filters. It delivers deep contrast and rich tonal separation, making it ideal for landscape, architecture, and fine art photography. Retro 80S produces crisp, dramatic images with a distinctive look that blends classic and technical precision.	\N	\N
21	Rollei Infrared 400	Rollei	{35mm,120,"Large Format (4x5)"}	400	f	high	medium	Rollei Infrared 400 is a black and white negative film with an ISO of 400 and extended sensitivity into the infrared spectrum. When used with an infrared filter, it produces surreal effects like bright white foliage and darkened skies, creating a dreamlike or otherworldly look. It has medium grain, high contrast, and strong tonal separation, making it suitable for experimental, landscape, and fine art photography. Without a filter, it behaves like a conventional panchromatic film with bold, punchy results.	\N	\N
22	AgfaPhoto Vista Plus 200	AgfaPhoto	{35mm,120}	200	t	medium	fine	AgfaPhoto Vista Plus 200 is a daylight-balanced color negative film with an ISO of 200, known for its punchy contrast, vivid colors, and fine grain. It delivers warm tones and strong saturation, especially in reds and blues, making it a solid choice for everyday shooting, travel, and casual street photography. Vista Plus 200 performs best in bright conditions and offers a fun, slightly vintage look with bold character and reliable sharpness.	\N	\N
23	Foma Fomapan 100 Classic	Foma	{35mm,120,"Large Format (4x5)","Large Format (8x10)"}	100	f	medium	fine	Foma Fomapan 100 Classic is a black and white negative film with an ISO of 100, offering fine grain, medium contrast, and a traditional tonal profile. It delivers smooth gradation, good sharpness, and a slightly softer look than modern T-grain films. Well suited for portraits, still life, and landscapes in bright light or studio conditions, Fomapan 100 Classic provides a timeless, vintage feel with a forgiving exposure range and easy darkroom handling.	\N	\N
24	Foma Fomapan 400	Foma	{35mm,120,"Large Format (4x5)","Large Format (8x10)"}	400	f	medium	medium	Foma Fomapan 400 is a black and white negative film with an ISO of 400, known for its classic grain structure, medium contrast, and soft tonal rendering. It offers good detail in both highlights and shadows, with a slightly vintage, less clinical look than modern high-speed films. Fomapan 400 performs reliably in varied lighting conditions and is suitable for street, documentary, and general-purpose photography, delivering expressive results with a traditional black and white aesthetic.	\N	\N
25	Adox Silvermax 100	Adox	{35mm}	100	f	medium	fine	Adox Silvermax 100 is a black and white negative film with an ISO of 100, designed for maximum silver content to produce deep blacks, rich contrast, and an exceptionally wide tonal range. It features fine grain, high sharpness, and smooth gradation, making it ideal for portrait, landscape, and fine art photography. When paired with the dedicated Silvermax developer, it delivers expanded dynamic range and dense, luminous highlights with a clean, classic look.	\N	\N
26	Bergger Pancro 400	Bergger	{35mm,120,"Large Format (4x5)","Large Format (8x10)"}	400	f	medium	medium	Bergger Pancro 400 is a black and white negative film with an ISO of 400, featuring a dual emulsion made of silver bromide and silver iodide for enhanced tonal depth and dynamic range. It offers medium grain, moderate contrast, and excellent detail in both shadows and highlights. Designed for versatility, Pancro 400 performs well in a wide range of lighting conditions and is favored for portrait, street, and fine art photography with a rich, organic look.	\N	\N
27	Ferrania P30 Alpha	Ferrania	{35mm}	80	f	high	fine	Ferrania P30 Alpha is a black and white negative film with an ISO of 80, inspired by the classic Ferrania cinema stocks of the mid-20th century. It features very high silver content, fine grain, and strong contrast, producing deep blacks and luminous highlights. P30 Alpha delivers a bold, cinematic look with limited latitude, making it best suited for controlled lighting and deliberate metering. Its striking tonality and vintage character make it a favorite for dramatic, stylized photography.	\N	\N
28	JCH StreetPan 400	Japan Camera Hunter	{35mm,120}	400	f	high	medium	JCH StreetPan 400 is a black and white negative film with an ISO of 400, originally developed for surveillance use and revived for street photography. It features a smooth grain structure, strong contrast, and extended red sensitivity, which enhances skies and skin tones. StreetPan delivers crisp detail and a bold, punchy look, performing well in overcast or low-light conditions. Its fast speed and classic rendering make it ideal for street, travel, and candid photography with a dramatic edge.	\N	\N
29	Kodak Gold 200	Kodak	{35mm,120}	200	t	medium	fine	Kodak Gold 200 is a daylight-balanced color negative film with an ISO of 200, known for its warm tones, rich color saturation, and fine grain. It offers medium contrast and forgiving exposure latitude, making it a popular choice for everyday shooting, travel, and family photography. Gold 200 performs best in bright or sunny conditions and delivers a nostalgic, vibrant look with a subtle vintage charm that is easy to scan and pleasing across formats.	\N	\N
30	Kodak Ultramax 400	Kodak	{35mm,120}	400	t	medium	medium	Kodak Ultramax 400 is a versatile, daylight-balanced color negative film with an ISO of 400, offering vibrant color, noticeable grain, and wide exposure latitude. It performs well in a variety of lighting conditions, making it ideal for casual shooting, travel, and everyday moments. Ultramax leans toward warm tones with strong contrast, delivering bold, punchy images with a slightly vintage character that appeals to both beginners and nostalgic shooters alike.	\N	\N
31	Fujifilm Superia X-TRA 400	Fujifilm	{35mm,120}	400	t	medium	medium	Fujifilm Superia X-TRA 400 is a daylight-balanced color negative film with an ISO of 400, known for its vibrant color palette, fine grain, and versatility. It delivers punchy greens and reds with medium contrast, making it well suited for everyday photography, travel, and fast-paced environments. Superia handles mixed lighting reliably and offers good exposure latitude, producing crisp, saturated images with a slightly cool, classic Fuji look.	\N	\N
32	Ilford Delta 100	Ilford	{35mm,120,"Large Format (4x5)","Large Format (8x10)"}	100	f	medium	fine	Ilford Delta 100 is a black and white negative film with an ISO of 100, featuring a modern T-grain emulsion that delivers exceptional sharpness, fine grain, and smooth tonal transitions. It offers medium contrast and a clean, refined look, making it ideal for landscapes, architecture, and studio work. Delta 100 performs best in bright or controlled lighting and produces elegant, detailed images with excellent highlight and shadow separation.	\N	\N
33	Fujifilm Instax Mini	Fujifilm	{"Fujifilm Instax Mini"}	800	t	medium	medium	Fujifilm Instax Mini is an instant color film designed for small-format cameras, producing credit card-sized prints with a distinctive retro charm. It offers vivid color reproduction, soft contrast, and a glossy finish, making it perfect for casual portraits, parties, and spontaneous moments. Instax Mini develops in seconds and performs best in bright light, delivering fun, tangible memories with a playful aesthetic that is ideal for everyday snapshots.	\N	\N
34	Fujifilm Instax Square	Fujifilm	{"Fujifilm Instax Square"}	800	t	medium	medium	Fujifilm Instax Square is an instant color film that produces square-format prints with vibrant colors, soft contrast, and a glossy finish. It offers a balanced, slightly vintage look that works well for portraits, still life, and lifestyle shots. With quick development time and reliable performance in bright to moderate lighting, Instax Square combines the charm of classic instant photography with a modern twist, delivering visually pleasing, shareable moments in a timeless format.	\N	\N
35	Fujifilm Instax Wide	Fujifilm	{"Fujifilm Instax Wide"}	800	t	medium	medium	Fujifilm Instax Wide is an instant color film designed for larger-format cameras, producing wide prints with bold colors, soft contrast, and a glossy surface. It offers more room for group shots, landscapes, and creative compositions while maintaining reliable sharpness and color accuracy. With fast development and a nostalgic feel, Instax Wide is ideal for events, travel, and storytelling moments that benefit from a broader frame and classic instant film charm.	\N	\N
36	Polaroid i-Type Film	Polaroid	{"Polaroid Film"}	640	t	medium	medium	Polaroid i-Type Film is a modern instant color film designed for Polaroid i-Type cameras, offering classic square-format prints with rich, saturated colors and a soft, vintage aesthetic. It features a glossy finish, balanced contrast, and iconic Polaroid white borders. With no built-in battery, it is more eco-friendly and affordable than traditional Polaroid 600 film. Ideal for portraits, everyday moments, and creative experiments, i-Type delivers the timeless look of Polaroid with improved consistency and ease of use.	\N	\N
37	Polaroid 600 Film	Polaroid	{"Polaroid Film"}	640	t	medium	medium	Polaroid 600 Film is a color instant film made for vintage Polaroid 600 cameras, delivering classic square prints with bold colors, soft contrast, and the iconic white frame. It includes a built-in battery pack to power older cameras and produces a nostalgic look with subtle imperfections and light sensitivity. Ideal for portraits, casual snapshots, and creative projects, Polaroid 600 captures the unpredictable charm and warmth of traditional instant photography.	\N	\N
38	Polaroid SX-70 Film	Polaroid	{"Polaroid Film"}	160	t	low	fine	Polaroid SX-70 Film is a color instant film designed for use with classic SX-70 cameras, featuring lower ISO sensitivity and fine detail rendering. It produces warm tones, soft contrast, and a distinctive vintage look with the iconic square format and white border. Due to its slower speed, it performs best in bright, even lighting or with flash. SX-70 Film is ideal for artistic, deliberate shooting and delivers the dreamy, analog aesthetic that defines early Polaroid photography.	\N	\N
39	Polaroid 8x10 Film	Polaroid	{"Polaroid (8x10)"}	640	t	medium	medium	Polaroid 8x10 Film is a large-format instant film that produces high-resolution prints with rich color depth, smooth tonal transitions, and a classic analog character. Designed for use with specialized 8x10 cameras and processing equipment, it offers unparalleled detail and a unique, tangible presence. This film is ideal for portrait, fine art, and studio photography, delivering one-of-a-kind results with a handcrafted feel that highlights the beauty of large-format instant imaging.	\N	\N
40	Shanghai GP3 100	Shanghai	{35mm,120,"Large Format (4x5)","Large Format (8x10)"}	100	f	medium	fine	Shanghai GP3 100 is a black and white negative film with an ISO of 100, offering classic grain, medium contrast, and a slightly vintage tonal character. It delivers smooth gradation and moderate sharpness, making it well suited for portraits, still life, and traditional black and white work. Best used in bright or controlled lighting, GP3 100 provides a nostalgic aesthetic with a distinctive rendering that appeals to analog purists and experimental photographers alike.	\N	\N
\.


--
-- TOC entry 4809 (class 0 OID 17554)
-- Dependencies: 220
-- Data for Name: recommendations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.recommendations (id, answer_combination, film_stock_1, film_stock_2, film_stock_3) FROM stdin;
1	35mm, Low Light / Night, Landscapes, Color, Medium ISO (400-800), Low Contrast, Medium Grain, Balanced, Vintage, Dreamy	2	31	30
3	35mm, Low Light / Night, Portraits, Color, Medium ISO (400-800), High Contrast, Fine Grain, Cool, Vintage, Dreamy	17	3	8
5	35mm, Daylight (Sunny), Landscapes, Color, Low ISO (50-200), Medium Contrast, Medium Grain, Cool, Modern, Dreamy	11	16	22
7	Large Format, Street Photography, Color, Medium ISO (400-800), Medium Contrast, Medium Grain, Cool, Vintage, Dreamy, 8x10	2	1	9
9	35mm, Golden Hour / Sunset, Street Photography, Black & White, Medium ISO (400-800), Low Contrast, Medium Grain, Warm, Doesn’t matter, Doesn’t matter	12	5	24
11	Large Format, Landscapes, Color, Medium ISO (400-800), High Contrast, Medium Grain, Warm, Doesn’t matter, Doesn’t matter, 8x10	2	4	9
13	35mm, Low Light / Night, Experimental / Abstract, Black & White, High ISO (1600+), High Contrast, Heavy Grain, Balanced, Doesn’t matter, Doesn’t matter	7	13	6
15	Large Format, Experimental / Abstract, Black & White, High ISO (1600+), High Contrast, Heavy Grain, Balanced, Doesn’t matter, Doesn’t matter, 8x10	13	5	21
17	120 (Medium Format), Golden Hour / Sunset, Landscapes, Color, Low ISO (50-200), High Contrast, Fine Grain, Warm, Modern, Sharp	11	4	9
19	Large Format, Street Photography, Color, Low ISO (50-200), Low Contrast, Fine Grain, Warm, Vintage, Sharp, 4x5	1	4	9
21	Large Format, Portraits, Color, Low ISO (50-200), Low Contrast, Fine Grain, Warm, Vintage, Sharp, Fujifilm Instax Mini, 4x5	1	11	4
23	35mm, Daylight (Sunny), Portraits, Color, Low ISO (50-200), Low Contrast, Fine Grain, Warm, Vintage, Sharp	1	4	22
25	35mm, Daylight (Sunny), Portraits, Color, Medium ISO (400-800), Medium Contrast, Medium Grain, Cool, Modern, Dreamy	2	8	17
27	Large Format, Daylight (Sunny), Portraits, Color, Low ISO (50-200), Medium Contrast, Medium Grain, Cool, Modern, Dreamy, 4x5	1	4	9
29	35mm, Daylight (Sunny), Landscapes, Color, Medium ISO (400-800), Medium Contrast, Medium Grain, Cool, Modern, Dreamy	2	8	17
31	120 (Medium Format), Golden Hour / Sunset, Landscapes, Color, Medium ISO (400-800), Medium Contrast, Medium Grain, Cool, Modern, Dreamy	2	8	17
33	120 (Medium Format), Low Light / Night, Street Photography, Color, Low ISO (50-200), Medium Contrast, Medium Grain, Balanced, Vintage, Dreamy	19	16	22
34	35mm, Golden Hour / Sunset, Experimental / Abstract, Black & White, Medium ISO (400-800), Medium Contrast, Heavy Grain, Cool, Doesn’t matter, Dreamy	12	28	13
36	120 (Medium Format), Indoor / Studio Lighting, Architecture / Urban Scenes, Color, Medium ISO (400-800), Medium Contrast, Medium Grain, Cool, Modern, Dreamy	2	31	17
38	120 (Medium Format), Indoor / Studio Lighting, Street Photography, Color, High ISO (1600+), High Contrast, Heavy Grain, Balanced, Modern, Dreamy	17	18	3
40	35mm, Golden Hour / Sunset, Street Photography, Black & White, High ISO (1600+), High Contrast, Medium Grain, Cool, Modern, Dreamy	6	7	13
42	35mm, Low Light / Night, Architecture / Urban Scenes, Color, High ISO (1600+), Medium Contrast, Medium Grain, Cool, Modern, Dreamy	17	18	31
44	120 (Medium Format), Golden Hour / Sunset, Street Photography, Black & White, Low ISO (50-200), Medium Contrast, Fine Grain, Cool, Vintage, Doesn’t matter	10	14	20
46	35mm, Golden Hour / Sunset, Street Photography, Black & White, Medium ISO (400-800), Low Contrast, Medium Grain, Cool, Modern, Dreamy	12	24	28
48	35mm, Golden Hour / Sunset, Portraits, Black & White, Medium ISO (400-800), Medium Contrast, Fine Grain, Cool, Modern, Dreamy	12	\N	5
50	35mm, Low Light / Night, Street Photography, Black & White, Medium ISO (400-800), Medium Contrast, Medium Grain, Cool, Modern, Dreamy	12	5	28
52	35mm, Low Light / Night, Street Photography, Color, Medium ISO (400-800), Medium Contrast, Medium Grain, Cool, Modern, Dreamy	17	3	31
54	35mm, Daylight (Sunny), Portraits, Black & White, High ISO (1600+), High Contrast, Heavy Grain, Balanced, Doesn’t matter, Doesn’t matter	7	6	13
56	Large Format, Daylight (Sunny), Architecture / Urban Scenes, Black & White, Low ISO (50-200), High Contrast, Medium Grain, Warm, Doesn’t matter, Dreamy, 4x5	15	10	14
58	35mm, Daylight (Sunny), Portraits, Color, Medium ISO (400-800), High Contrast, Heavy Grain, Balanced, Doesn’t matter, Doesn’t matter	3	17	31
60	35mm, Indoor / Studio Lighting, Street Photography, Color, Medium ISO (400-800), High Contrast, Fine Grain, Cool, Modern, Dreamy	3	17	2
62	35mm, Golden Hour / Sunset, Landscapes, Color, Medium ISO (400-800), Medium Contrast, Medium Grain, Cool, Modern, Dreamy	2	17	31
64	35mm, Golden Hour / Sunset, Landscapes, Color, Low ISO (50-200), Low Contrast, Medium Grain, Cool, Modern, Dreamy	16	11	4
66	35mm, Golden Hour / Sunset, Landscapes, Color, Low ISO (50-200), High Contrast, Fine Grain, Warm, Vintage, Sharp	11	4	9
68	35mm, Indoor / Studio Lighting, Portraits, Color, Medium ISO (400-800), High Contrast, Fine Grain, Balanced, Vintage, Doesn’t matter	2	3	8
70	35mm, Low Light / Night, Landscapes, Black & White, Medium ISO (400-800), Medium Contrast, Medium Grain, Cool, Modern, Dreamy	12	5	28
72	Large Format, Golden Hour / Sunset, Landscapes, Color, Low ISO (50-200), High Contrast, Fine Grain, Warm, Vintage, Doesn’t matter, 8x10	11	4	1
74	35mm, Golden Hour / Sunset, Portraits, Color, Medium ISO (400-800), Medium Contrast, Heavy Grain, Cool, Modern, Sharp	17	3	30
76	35mm, Indoor / Studio Lighting, Street Photography, Color, Medium ISO (400-800), Medium Contrast, Medium Grain, Cool, Modern, Dreamy	2	31	30
78	120 (Medium Format), Low Light / Night, Portraits, Black & White, Low ISO (50-200), Medium Contrast, Heavy Grain, Balanced, Modern, Sharp	13	12	28
80	Large Format, Golden Hour / Sunset, Landscapes, Color, Low ISO (50-200), Low Contrast, Fine Grain, Warm, Vintage, Sharp, 8x10	1	4	11
82	120 (Medium Format), Golden Hour / Sunset, Architecture / Urban Scenes, Black & White, Medium ISO (400-800), Low Contrast, Medium Grain, Cool, Vintage, Dreamy	12	24	26
\.


--
-- TOC entry 4817 (class 0 OID 0)
-- Dependencies: 217
-- Name: film_stocks_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.film_stocks_id_seq', 40, true);


--
-- TOC entry 4818 (class 0 OID 0)
-- Dependencies: 219
-- Name: recommendations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.recommendations_id_seq', 83, true);


--
-- TOC entry 4651 (class 2606 OID 17552)
-- Name: film_stocks film_stocks_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.film_stocks
    ADD CONSTRAINT film_stocks_name_key UNIQUE (name);


--
-- TOC entry 4653 (class 2606 OID 17550)
-- Name: film_stocks film_stocks_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.film_stocks
    ADD CONSTRAINT film_stocks_pkey PRIMARY KEY (id);


--
-- TOC entry 4655 (class 2606 OID 17563)
-- Name: recommendations recommendations_answer_combination_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.recommendations
    ADD CONSTRAINT recommendations_answer_combination_key UNIQUE (answer_combination);


--
-- TOC entry 4657 (class 2606 OID 17561)
-- Name: recommendations recommendations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.recommendations
    ADD CONSTRAINT recommendations_pkey PRIMARY KEY (id);


--
-- TOC entry 4658 (class 2606 OID 17564)
-- Name: recommendations recommendations_film_stock_1_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.recommendations
    ADD CONSTRAINT recommendations_film_stock_1_fkey FOREIGN KEY (film_stock_1) REFERENCES public.film_stocks(id) ON DELETE CASCADE;


--
-- TOC entry 4659 (class 2606 OID 17569)
-- Name: recommendations recommendations_film_stock_2_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.recommendations
    ADD CONSTRAINT recommendations_film_stock_2_fkey FOREIGN KEY (film_stock_2) REFERENCES public.film_stocks(id) ON DELETE CASCADE;


--
-- TOC entry 4660 (class 2606 OID 17574)
-- Name: recommendations recommendations_film_stock_3_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.recommendations
    ADD CONSTRAINT recommendations_film_stock_3_fkey FOREIGN KEY (film_stock_3) REFERENCES public.film_stocks(id) ON DELETE CASCADE;


-- Completed on 2025-05-04 01:08:09

--
-- PostgreSQL database dump complete
--

