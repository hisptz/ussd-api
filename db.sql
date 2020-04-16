--
-- PostgreSQL database dump
--

-- Dumped from database version 10.12 (Ubuntu 10.12-0ubuntu0.18.04.1)
-- Dumped by pg_dump version 10.12 (Ubuntu 10.12-0ubuntu0.18.04.1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: application; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.application (
    id integer NOT NULL,
    name character varying(255),
    update_date character varying(255),
    description character varying(255),
    session_key character varying(255),
    user_response character varying(255),
    datastore_key character varying(255),
    key character varying(255),
    first_request character varying(255),
    continue_request character varying(255),
    terminated_by_provider character varying(255),
    timed_out character varying(255),
    phone_number_key character varying(255),
    no_user_message character varying(255),
    starting_menu character varying(255),
    sync_servers text,
    auth_based_on character varying(255),
    session_timeout_determinant json,
    phone_number_mapping text,
    auto_generated_field text
);


ALTER TABLE public.application OWNER TO postgres;

--
-- Name: application_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.application_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.application_id_seq OWNER TO postgres;

--
-- Name: application_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.application_id_seq OWNED BY public.application.id;


--
-- Name: datavalues; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.datavalues (
    id integer NOT NULL,
    sessionid character varying(255),
    period character varying(255),
    year character varying(255),
    datatype character varying(255),
    program character varying(255),
    "programStage" character varying(255),
    "dataValues" json DEFAULT '[]'::json,
    event character varying(255),
    data_set character varying(255),
    "trackedEntityType" character varying(255)
);


ALTER TABLE public.datavalues OWNER TO postgres;

--
-- Name: datavalues_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.datavalues_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.datavalues_id_seq OWNER TO postgres;

--
-- Name: datavalues_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.datavalues_id_seq OWNED BY public.datavalues.id;


--
-- Name: knex_migrations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.knex_migrations (
    id integer NOT NULL,
    name character varying(255),
    batch integer,
    migration_time timestamp with time zone
);


ALTER TABLE public.knex_migrations OWNER TO postgres;

--
-- Name: knex_migrations_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.knex_migrations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.knex_migrations_id_seq OWNER TO postgres;

--
-- Name: knex_migrations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.knex_migrations_id_seq OWNED BY public.knex_migrations.id;


--
-- Name: knex_migrations_lock; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.knex_migrations_lock (
    is_locked integer
);


ALTER TABLE public.knex_migrations_lock OWNER TO postgres;

--
-- Name: menu; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.menu (
    id integer NOT NULL,
    menu_id character varying(255),
    application_id character varying(255),
    title character varying(255),
    type character varying(255),
    options text,
    previous_menu character varying(255),
    data_id character varying(255),
    next_menu character varying(255),
    data_type character varying(255),
    data_name character varying(255),
    auth_key character varying(255),
    fail_message character varying(255),
    retry_message character varying(255),
    number_of_retries character varying(255),
    submission_message character varying(255),
    submit_data boolean,
    p_rules text,
    period_type character varying(255),
    maximum_value integer,
    use_for_year boolean,
    years_back character varying(255),
    field_value_type character varying(255),
    field_short_name character varying(255),
    data_element character varying(255),
    category_combo character varying(255),
    data_set character varying(255),
    program character varying(255),
    program_stage character varying(255),
    mode character varying(255),
    tracked_entity_type character varying(255),
    tracked_entity_attribute character varying(255)
);


ALTER TABLE public.menu OWNER TO postgres;

--
-- Name: menu_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.menu_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.menu_id_seq OWNER TO postgres;

--
-- Name: menu_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.menu_id_seq OWNED BY public.menu.id;


--
-- Name: sessions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sessions (
    id character varying(255),
    sessionid character varying(255),
    name character varying(255),
    currentmenu character varying(255),
    retries integer,
    "orgUnit" character varying(255),
    application_id character varying(255),
    msisdn character varying(255),
    done boolean,
    started timestamp with time zone
);


ALTER TABLE public.sessions OWNER TO postgres;

--
-- Name: sms; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sms (
    sms_id integer NOT NULL,
    text character varying(255),
    status character varying(255),
    phone_numbers json,
    session_id character varying(255)
);


ALTER TABLE public.sms OWNER TO postgres;

--
-- Name: sms_sms_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.sms_sms_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.sms_sms_id_seq OWNER TO postgres;

--
-- Name: sms_sms_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.sms_sms_id_seq OWNED BY public.sms.sms_id;


--
-- Name: sync; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sync (
    id integer NOT NULL,
    syncserver_id character varying(255),
    session_id character varying(255),
    synced boolean,
    retries integer,
    notified boolean
);


ALTER TABLE public.sync OWNER TO postgres;

--
-- Name: sync_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.sync_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.sync_id_seq OWNER TO postgres;

--
-- Name: sync_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.sync_id_seq OWNED BY public.sync.id;


--
-- Name: sync_server; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sync_server (
    id integer NOT NULL,
    application_id character varying(255),
    url character varying(255),
    username character varying(255),
    password character varying(255),
    admin_email character varying(255)
);


ALTER TABLE public.sync_server OWNER TO postgres;

--
-- Name: sync_server_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.sync_server_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.sync_server_id_seq OWNER TO postgres;

--
-- Name: sync_server_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.sync_server_id_seq OWNED BY public.sync_server.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    name character varying(255),
    "phoneNumber" character varying(255),
    sessionid character varying(255)
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.users_id_seq OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: application id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.application ALTER COLUMN id SET DEFAULT nextval('public.application_id_seq'::regclass);


--
-- Name: datavalues id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.datavalues ALTER COLUMN id SET DEFAULT nextval('public.datavalues_id_seq'::regclass);


--
-- Name: knex_migrations id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.knex_migrations ALTER COLUMN id SET DEFAULT nextval('public.knex_migrations_id_seq'::regclass);


--
-- Name: menu id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.menu ALTER COLUMN id SET DEFAULT nextval('public.menu_id_seq'::regclass);


--
-- Name: sms sms_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sms ALTER COLUMN sms_id SET DEFAULT nextval('public.sms_sms_id_seq'::regclass);


--
-- Name: sync id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sync ALTER COLUMN id SET DEFAULT nextval('public.sync_id_seq'::regclass);


--
-- Name: sync_server id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sync_server ALTER COLUMN id SET DEFAULT nextval('public.sync_server_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: application; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.application (id, name, update_date, description, session_key, user_response, datastore_key, key, first_request, continue_request, terminated_by_provider, timed_out, phone_number_key, no_user_message, starting_menu, sync_servers, auth_based_on, session_timeout_determinant, phone_number_mapping, auto_generated_field) FROM stdin;
1	IDSR USSD Manager	2020-03-31T09:18:15.038	Ussd manager for IDSR project	sessionid	USSDRequest	idsr	USSDType	NR	CR	UC	T	msisdn	Samahani hujasajiliwa kutumia mfumo wa eIDSR	VkkB3zN0ljWIKZjyCLyKdkgNAZ8fMe9	[{"url":"https://hisptz.com/idsr","email":"jessejustinm@gmail.com","password":"Mdachi@2020","username":"jmdachi"}]	USERPHONENUMBER	{"type":"MEDIATOR","timeout":2}	\N	\N
\.


--
-- Data for Name: datavalues; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.datavalues (id, sessionid, period, year, datatype, program, "programStage", "dataValues", event, data_set, "trackedEntityType") FROM stdin;
348	517996192	\N	\N	tracker	bWW1WxiP9lY		{"trackedEntityType":"XjMhM0eneKI","orgUnit":"m0frOspS7JY","enrollments":[{"trackedEntityInstance":"hIZl71oQb8U","program":"bWW1WxiP9lY","status":"ACTIVE","orgUnit":"m0frOspS7JY","enrollmentDate":"2020-03-31","incidentDate":"2020-03-31"}],"attributes":[{"attribute":"DWD892cNO8q","value":"Acute Flaccid Paralysis"},{"attribute":"auNpv9QUve4","value":"1"},{"attribute":"HqazINzzsEZ","value":"Days"},{"attribute":"PVF0hs3YxRz","value":"1"},{"attribute":"odR6HcTNgEW","value":"Female"},{"attribute":"b4xVFUUgMP2","value":"Confirmed"},{"attribute":"fbIXx7uohES","value":"No"},{"attribute":"ae0ReCg7C0G","value":true},{"attribute":"bTqb2dov2Pl","value":"Discarded"},{"attribute":"oqpyDVwngtS","value":true},{"attribute":"UiKNNd6Bs6R","value":"Admitted"},{"attribute":"jKXm6hkYeFo","value":true},{"attribute":"rj1WYTe0280","value":true},{"attribute":"uzrHtpkbkl7","value":true},{"attribute":"ktm7DdZK6M8","value":true},{"attribute":"hK09K0f7F4N","value":true}]}	\N		XjMhM0eneKI
349	372181118	\N	\N	tracker	bWW1WxiP9lY		{"trackedEntityType":"XjMhM0eneKI","orgUnit":"m0frOspS7JY","enrollments":[{"program":"bWW1WxiP9lY","status":"ACTIVE","orgUnit":"m0frOspS7JY","enrollmentDate":"2020-03-31","incidentDate":"2020-03-31"}],"attributes":[{"attribute":"DWD892cNO8q","value":"Acute Flaccid Paralysis"},{"attribute":"auNpv9QUve4","value":"1"},{"attribute":"HqazINzzsEZ","value":"Days"},{"attribute":"PVF0hs3YxRz","value":"1"},{"attribute":"odR6HcTNgEW","value":"Female"},{"attribute":"b4xVFUUgMP2","value":"Confirmed"},{"attribute":"fbIXx7uohES","value":"No"},{"attribute":"ae0ReCg7C0G","value":true},{"attribute":"bTqb2dov2Pl","value":"Discarded"},{"attribute":"oqpyDVwngtS","value":true},{"attribute":"UiKNNd6Bs6R","value":"Admitted"},{"attribute":"jKXm6hkYeFo","value":true},{"attribute":"rj1WYTe0280","value":true},{"attribute":"uzrHtpkbkl7","value":true},{"attribute":"ktm7DdZK6M8","value":true},{"attribute":"hK09K0f7F4N","value":true}]}	\N		XjMhM0eneKI
350	643618228	\N	\N	tracker	bWW1WxiP9lY		{"trackedEntityType":"XjMhM0eneKI","orgUnit":"m0frOspS7JY","enrollments":[{"program":"bWW1WxiP9lY","status":"ACTIVE","orgUnit":"m0frOspS7JY","enrollmentDate":"2020-03-31","incidentDate":"2020-03-31"}],"attributes":[{"attribute":"DWD892cNO8q","value":"Acute Flaccid Paralysis"},{"attribute":"auNpv9QUve4","value":"1"},{"attribute":"HqazINzzsEZ","value":"Days"},{"attribute":"PVF0hs3YxRz","value":"1"},{"attribute":"odR6HcTNgEW","value":"Female"},{"attribute":"b4xVFUUgMP2","value":"Confirmed"},{"attribute":"fbIXx7uohES","value":"No"},{"attribute":"ae0ReCg7C0G","value":true},{"attribute":"bTqb2dov2Pl","value":"Discarded"},{"attribute":"oqpyDVwngtS","value":true},{"attribute":"UiKNNd6Bs6R","value":"Admitted"},{"attribute":"jKXm6hkYeFo","value":true},{"attribute":"rj1WYTe0280","value":true},{"attribute":"uzrHtpkbkl7","value":true},{"attribute":"ktm7DdZK6M8","value":true},{"attribute":"hK09K0f7F4N","value":true}]}	\N		XjMhM0eneKI
351	841228322	\N	\N	tracker	bWW1WxiP9lY		{"trackedEntityInstance":"EG9WVMIrved","trackedEntityType":"XjMhM0eneKI","orgUnit":"m0frOspS7JY","enrollments":[{"trackedEntityInstance":"EG9WVMIrved","program":"bWW1WxiP9lY","status":"ACTIVE","orgUnit":"m0frOspS7JY","enrollmentDate":"2020-03-31","incidentDate":"2020-03-31"}],"attributes":[{"attribute":"DWD892cNO8q","value":"Acute Flaccid Paralysis"},{"attribute":"auNpv9QUve4","value":"1"},{"attribute":"HqazINzzsEZ","value":"Days"},{"attribute":"PVF0hs3YxRz","value":"1"},{"attribute":"odR6HcTNgEW","value":"Female"},{"attribute":"b4xVFUUgMP2","value":"Confirmed"},{"attribute":"fbIXx7uohES","value":"No"},{"attribute":"ae0ReCg7C0G","value":true},{"attribute":"bTqb2dov2Pl","value":"Discarded"},{"attribute":"oqpyDVwngtS","value":true},{"attribute":"UiKNNd6Bs6R","value":"Admitted"},{"attribute":"jKXm6hkYeFo","value":true},{"attribute":"rj1WYTe0280","value":true},{"attribute":"uzrHtpkbkl7","value":true},{"attribute":"ktm7DdZK6M8","value":true},{"attribute":"hK09K0f7F4N","value":true}]}	\N		XjMhM0eneKI
352	559146435	\N	\N	tracker	bWW1WxiP9lY		{"trackedEntityInstance":"tgliHk8HBRS","trackedEntityType":"XjMhM0eneKI","orgUnit":"m0frOspS7JY","enrollments":[{"trackedEntityInstance":"tgliHk8HBRS","program":"bWW1WxiP9lY","status":"ACTIVE","orgUnit":"m0frOspS7JY","enrollmentDate":"2020-03-31","incidentDate":"2020-03-31"}],"attributes":[{"attribute":"DWD892cNO8q","value":"Acute Flaccid Paralysis"},{"attribute":"auNpv9QUve4","value":"12"},{"attribute":"HqazINzzsEZ","value":"Months"},{"attribute":"PVF0hs3YxRz","value":"5"},{"attribute":"odR6HcTNgEW","value":"Male"},{"attribute":"b4xVFUUgMP2","value":"Probable"},{"attribute":"fbIXx7uohES","value":"No"},{"attribute":"ae0ReCg7C0G","value":false},{"attribute":"bTqb2dov2Pl","value":"District Lab"},{"attribute":"oqpyDVwngtS","value":true},{"attribute":"UiKNNd6Bs6R","value":"Discharged"},{"attribute":"jKXm6hkYeFo","value":false},{"attribute":"rj1WYTe0280","value":true},{"attribute":"uzrHtpkbkl7","value":false},{"attribute":"ktm7DdZK6M8","value":true},{"attribute":"hK09K0f7F4N","value":false}]}	\N		XjMhM0eneKI
\.


--
-- Data for Name: knex_migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.knex_migrations (id, name, batch, migration_time) FROM stdin;
1	20160802144759_users.js	1	2020-02-24 13:10:29.279+03
2	20180319123215_sessions.js	1	2020-02-24 13:10:29.286+03
3	20180326112127_datavalues.js	1	2020-02-24 13:10:29.296+03
182	20200309132207_application.js	2	2020-03-31 12:38:03.069+03
183	20200309132807_sync_server.js	2	2020-03-31 12:38:03.077+03
184	20200309132817_sync.js	2	2020-03-31 12:38:03.084+03
185	20200309132829_sms.js	2	2020-03-31 12:38:03.091+03
186	20200309132845_menu.js	2	2020-03-31 12:38:03.1+03
\.


--
-- Data for Name: knex_migrations_lock; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.knex_migrations_lock (is_locked) FROM stdin;
0
\.


--
-- Data for Name: menu; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.menu (id, menu_id, application_id, title, type, options, previous_menu, data_id, next_menu, data_type, data_name, auth_key, fail_message, retry_message, number_of_retries, submission_message, submit_data, p_rules, period_type, maximum_value, use_for_year, years_back, field_value_type, field_short_name, data_element, category_combo, data_set, program, program_stage, mode, tracked_entity_type, tracked_entity_attribute) FROM stdin;
1	1CkSZm3UpWNLL9hHb5dmbi3tkxnzkzs	1	eIDSR	options	[{"id":"zUJ9BjMbJVLRpCiozoYcWyP4G2DmJrq","title":"Process Immediate Reporting","response":"1","next_menu":""},{"id":"HllB2bYFlekKzDyaQwg2MiHIYbF0nof","title":"Weekly Reporting Processes","response":"2","next_menu":"OyUIi2VZoS1Q1GTeEyq8BmieL4ovWsX"},{"id":"DTeEwFivCIlJqAs6NEv6AIE9U65C4p3","title":"Maternal Death Reporting","response":"3","next_menu":""}]											f			\N	f									\N	\N	\N
2	OyUIi2VZoS1Q1GTeEyq8BmieL4ovWsX	1	Weekly Reporting	options	[{"id":"9f7nwYGcrYghylM2wumueqxSUGPR8eo","title":"Weekly Reporting","response":"1","next_menu":"fMzB56I82MoKkgjrR0gf8jeAw3BVe90"}]	1CkSZm3UpWNLL9hHb5dmbi3tkxnzkzs										f			\N	f									\N	\N	\N
3	fMzB56I82MoKkgjrR0gf8jeAw3BVe90	1	Enter Epidemilogical Week Number	options	[{"id":"NPQe6Yh0Nk9QOIYtTnp0HMBuZRFnAr6","title":"Enter Year (yyyy)","response":"1","next_menu":"wEwswtiZ237LDDypqWkWQ5FzPvBYMv4"}]	OyUIi2VZoS1Q1GTeEyq8BmieL4ovWsX										f			\N	f									\N	\N	\N
4	wEwswtiZ237LDDypqWkWQ5FzPvBYMv4	1	Enter Year (yyyy)	period	[]	fMzB56I82MoKkgjrR0gf8jeAw3BVe90		mXJDa40oU5CGzPhObhswvSS3RFSnJvo								f			\N	t									\N	\N	\N
5	mXJDa40oU5CGzPhObhswvSS3RFSnJvo	1	Select Disease	options	[{"id":"115571aJUkozA4BDfMzF3OJQhpKBf0D","title":"Malaria","response":"1","next_menu":""},{"id":"WDsqtO5nK35MqgjfdNfXlIegm4Wjq8x","title":"Pneumonia","response":"2","next_menu":"HEpd36suEvvgAwWoFBKuvHds7YSr8UO"},{"id":"aZ3FGznrY2x72X7N6sgIw243aRoyptK","title":"Malnutrition","response":"3","next_menu":""}]	wEwswtiZ237LDDypqWkWQ5FzPvBYMv4										f			\N	f									\N	\N	\N
6	HEpd36suEvvgAwWoFBKuvHds7YSr8UO	1	IDSR Pneumonia <5 Years Case, < 5, ME	data	[]	mXJDa40oU5CGzPhObhswvSS3RFSnJvo	qXCZieHvyrA.AttDwO4xCIu	qJBpeTlJsAA2Q0VsRWVzvYDtfVV0rqI	aggregate	IDSR Pneumonia <5 Years Case, < 5, ME						f			\N	f		INTEGER_ZERO_OR_POSITIVE	Pneumonia Case < 5 ME	qXCZieHvyrA	AttDwO4xCIu	NDcgQeGaJC9			\N	\N	\N
7	qJBpeTlJsAA2Q0VsRWVzvYDtfVV0rqI	1	IDSR Pneumonia <5 Years Case, < 5, KE	data	[]	HEpd36suEvvgAwWoFBKuvHds7YSr8UO	qXCZieHvyrA.QInmZugn9JO	XrDw5gDWGqMttprzuzlvMZAjhyUFJy3	aggregate	IDSR Pneumonia <5 Years Case, < 5, KE						f			\N	f		INTEGER_ZERO_OR_POSITIVE	Pneumonia Case < 5 KE	qXCZieHvyrA	QInmZugn9JO	NDcgQeGaJC9			\N	\N	\N
8	XrDw5gDWGqMttprzuzlvMZAjhyUFJy3	1	IDSR Pneumonia <5 Years Case, > 5, ME	data	[]	qJBpeTlJsAA2Q0VsRWVzvYDtfVV0rqI	qXCZieHvyrA.FRzeEpefSK8	dyWh1vbvQxo7J6CAWxNTykwK7RLk8ER	aggregate	IDSR Pneumonia <5 Years Case, > 5, ME						f			\N	f		INTEGER_ZERO_OR_POSITIVE	Pneumonia Case > 5 ME	qXCZieHvyrA	FRzeEpefSK8	NDcgQeGaJC9			\N	\N	\N
9	dyWh1vbvQxo7J6CAWxNTykwK7RLk8ER	1	IDSR Pneumonia <5 Years Case, > 5, KE	data	[]	XrDw5gDWGqMttprzuzlvMZAjhyUFJy3	qXCZieHvyrA.q3GdT7f6iw9	aVmh7K8AM0iRTETqPdpR4LY8gNwoejT	aggregate	IDSR Pneumonia <5 Years Case, > 5, KE						f			\N	f		INTEGER_ZERO_OR_POSITIVE	Pneumonia Case > 5 KE	qXCZieHvyrA	q3GdT7f6iw9	NDcgQeGaJC9			\N	\N	\N
10	aVmh7K8AM0iRTETqPdpR4LY8gNwoejT	1	IDSR Pneumonia <5 Years Death , < 5, ME	data	[]	dyWh1vbvQxo7J6CAWxNTykwK7RLk8ER	qXCZieHvyrA.LZsl9VW71qr	E0Wlg7TQa9G2VKhUZhn6ivpVFSTMD1O	aggregate	IDSR Pneumonia <5 Years Death , < 5, ME						f			\N	f		INTEGER_ZERO_OR_POSITIVE	Pneumonia Death < 5 ME	qXCZieHvyrA	LZsl9VW71qr	NDcgQeGaJC9			\N	\N	\N
11	E0Wlg7TQa9G2VKhUZhn6ivpVFSTMD1O	1	IDSR Pneumonia <5 Years Death , < 5, KE	data	[]	aVmh7K8AM0iRTETqPdpR4LY8gNwoejT	qXCZieHvyrA.ifRTBcyGzHU	cr3MCXrRDRio8SdhUlg6ltJpvkOTbKx	aggregate	IDSR Pneumonia <5 Years Death , < 5, KE						f			\N	f		INTEGER_ZERO_OR_POSITIVE	Pneumonia Death < 5 KE	qXCZieHvyrA	ifRTBcyGzHU	NDcgQeGaJC9			\N	\N	\N
12	cr3MCXrRDRio8SdhUlg6ltJpvkOTbKx	1	IDSR Pneumonia <5 Years Death , > 5, ME	data	[]	E0Wlg7TQa9G2VKhUZhn6ivpVFSTMD1O	qXCZieHvyrA.lW9u3eKdMXH	hUPdi0SM3cWWalstE53K6Im1JcAZy7k	aggregate	IDSR Pneumonia <5 Years Death , > 5, ME						f			\N	f		INTEGER_ZERO_OR_POSITIVE	Pneumonia Death > 5 ME	qXCZieHvyrA	lW9u3eKdMXH	NDcgQeGaJC9			\N	\N	\N
13	hUPdi0SM3cWWalstE53K6Im1JcAZy7k	1	IDSR Pneumonia <5 Years Death , > 5, KE	data	[]	cr3MCXrRDRio8SdhUlg6ltJpvkOTbKx	qXCZieHvyrA.Q8U3fXSfxY8	PDspygHFShx8S8oYWF9LfqaGoRp0Ygz	aggregate	IDSR Pneumonia <5 Years Death , > 5, KE						f			\N	f		INTEGER_ZERO_OR_POSITIVE	Pneumonia Death > 5 KE	qXCZieHvyrA	Q8U3fXSfxY8	NDcgQeGaJC9			\N	\N	\N
14	PDspygHFShx8S8oYWF9LfqaGoRp0Ygz	1	You are about to submit data, are you sure?	data-submission	[]	hUPdi0SM3cWWalstE53K6Im1JcAZy7k										t			\N	f									\N	\N	\N
15	PFGvkHVSiRgaITq79yn1XzDUle8RR31	1		auth	[]											f			\N	f									\N	\N	\N
16	VkkB3zN0ljWIKZjyCLyKdkgNAZ8fMe9	1	Welcome to new eIDSR	auth	[]			peKiGAl2jiM3yglJ8CduJlUHRkbIr4C			1234	Fail to login. Please contact admin	Login Failed, try again	3		f			\N	f									\N	\N	\N
17	peKiGAl2jiM3yglJ8CduJlUHRkbIr4C	1	Select Option - New eIDSR	options	[{"id":"1et2nALgnmUlUF1kZI2rPiKZ5F1pAUi","title":"Immediate Reporting","response":"1","next_menu":"NVd4wtTY1i4sYAtMJzedU1EXfblkd2n"},{"id":"Q76WMGOGVzveXFfE0RdlVjqVHupBOs1","title":"Weekly Reporting","response":"2","next_menu":"HwHi9v648m2QathM0Abcoz406C70R1S"},{"id":"niWnYG8SCQM1boWMW1S1PJA2MZteZHu","title":"Submit weekly report","response":"3","next_menu":"1fuXjQQKdLMbxJHUennDQ2Samop7Wfv"}]	VkkB3zN0ljWIKZjyCLyKdkgNAZ8fMe9										f			\N	f									\N	\N	\N
18	NVd4wtTY1i4sYAtMJzedU1EXfblkd2n	1	Select Disease Group	options	[{"id":"PwxaeuOpJqzxTwQOZH7mp4ZdKr6Swhq","title":"Group 1: A-B","response":"1","next_menu":"tDcOOo5V8ItOIuEiZRTJS5EKht0xQWz"},{"id":"40fWrbWjWccbVeLpUQQ73vcPjDE8W96","title":"Group 2: C-G","response":"2","next_menu":"2Nc4MMF1jv6rcgUv7DMX8Xxu3Hr0nsM"},{"id":"rMOojCTRfb5elNQSPUt2MQc5kTz4dDY","title":"Group 3: H-Q","response":"3","next_menu":"0muasjn8FvzCWjafZuFXWt9IBCUTYDh"},{"id":"Q5bTqe0SnHMTfLMwuYW0cUvO1c3xAig","title":"Group 4: R-Z","response":"4","next_menu":"sWbxB4fanqRgj6LU4fPdRSGUG3ZBdGE"}]	peKiGAl2jiM3yglJ8CduJlUHRkbIr4C										f			\N	f									\N	\N	\N
19	NN6irWuGWKsuj4CxBE3v5hAAXSkI4Ic	1	Select option	options	[{"id":"6xy0yJV5HF2jXjZj2tgTAKVlWwM5ytV","title":"Immediate Reporting","response":"1","next_menu":"mXeJBKfbjF62f8ZElHpbFWwsujQS5Qv"}]	PFGvkHVSiRgaITq79yn1XzDUle8RR31										f			\N	f									\N	\N	\N
20	mXeJBKfbjF62f8ZElHpbFWwsujQS5Qv	1	Choose disease category	options	[{"id":"eTCvH9AGwrMv7JfHJH3exA4FFmcaZlv","title":"Group 1 A-G","response":"1","next_menu":"auMgrRpGFdQCpi5TO3v4BaImlj6erRO"}]	NN6irWuGWKsuj4CxBE3v5hAAXSkI4Ic										f			\N	f									\N	\N	\N
21	auMgrRpGFdQCpi5TO3v4BaImlj6erRO	1	IDSR Disease	data	[{"id":"RhglzwW0Stv","title":"A00.9-Cholera ","response":"1","value":"A00.9-Cholera "},{"id":"O1EI6g6MKIi","title":"Acute Flaccid Paralysis","response":"2","value":"Acute Flaccid Paralysis"},{"id":"B70JzjQ4KXX","title":"Anthrax","response":"3","value":"Anthrax"},{"id":"F8Pm816IpMH","title":"Blood diarrhoea","response":"4","value":"Blood diarrhoea"},{"id":"TWBvtjAyB60","title":"Cerebral Spinal Meningitis","response":"5","value":"Cerebral Spinal Meningitis"},{"id":"e4oD5L3E0B8","title":"Epidemic viral keratoconjuctivitis","response":"6","value":"Epidemic viral keratoconjuctivitis"}]	mXeJBKfbjF62f8ZElHpbFWwsujQS5Qv	Of2oRqwosOB	LWgmG3EBjvBMvG4pDY6an9Ze1h9AHDg	event	IDSR Disease						f			\N	f		TEXT	Disease	Of2oRqwosOB			Rt3ZfijCNSR	oIfXzXib4AE	\N	\N	\N
22	LWgmG3EBjvBMvG4pDY6an9Ze1h9AHDg	1	New Menu		[]	auMgrRpGFdQCpi5TO3v4BaImlj6erRO										f			\N	f									\N	\N	\N
60	lE0lsWD8qkH1ZFMPlsz7Hj83KamSUEJ	1	New Menu		[]	GQYmrt8KelF8PxbJRxTd6Y5ePvyo27Z										f			\N	f									\N	\N	\N
23	vLpzVM1P5TV9Ks1OcAZBNDCva0s3Oyb	1	IDSR Patient Age	data	[{"id":"gROcyTVfL8h","title":"Days","response":"1","value":"Days"},{"id":"vW2sozl2oPn","title":"Months","response":"2","value":"Months"},{"id":"zpdLUDfUUxt","title":"Years","response":"3","value":"Years"}]	7BsyqVvFzQ0Hp8jj9QjnynA3oxskRCo	wtS5qShG6FX	mcQNAtABcVmGIF5woMD5Ru26RT5xUGz	event	IDSR Patient Age						f			\N	f		INTEGER_POSITIVE	Patient Age	wtS5qShG6FX			Rt3ZfijCNSR	oIfXzXib4AE	\N	\N	\N
24	mcQNAtABcVmGIF5woMD5Ru26RT5xUGz	1	Sex	data	[{"id":"k9uPFST6kxm","title":"Female","response":"1","value":"Female"},{"id":"sHZeC3hmKwG","title":"Male","response":"2","value":"Male"}]	vLpzVM1P5TV9Ks1OcAZBNDCva0s3Oyb	UjPZIq15xs1	teLWSfRqsc4yUHc3GPBxbiz8HVXwUSu	event	Sex						f			\N	f		TEXT	Sex	UjPZIq15xs1			Rt3ZfijCNSR	oIfXzXib4AE	\N	\N	\N
25	teLWSfRqsc4yUHc3GPBxbiz8HVXwUSu	1	IDSR Case Definition	data	[{"id":"kK02ky0Z0pP","title":"Confirmed","response":"1","value":"Confirmed"},{"id":"AiiRMEPTuhr","title":"Probable","response":"2","value":"Probable"},{"id":"CVpB5Yveq0s","title":"Suspected","response":"3","value":"Suspected"}]	mcQNAtABcVmGIF5woMD5Ru26RT5xUGz	IfRo0jcAZpB	g8kJbzBm80c5VLHvKcKx4vfh33uJdyf	event	IDSR Case Definition						f			\N	f		TEXT	Case Definition	IfRo0jcAZpB			Rt3ZfijCNSR	oIfXzXib4AE	\N	\N	\N
26	g8kJbzBm80c5VLHvKcKx4vfh33uJdyf	1	IDSR Was patient Vaccinated	data	[{"id":"P9QrlSg3iDa","title":"No","response":"1","value":"No"},{"id":"qzHmwhHj9Sc","title":"Not Applicable","response":"2","value":"false"},{"id":"stS1n3ZPr2I","title":"Yes","response":"3","value":"Yes"}]	teLWSfRqsc4yUHc3GPBxbiz8HVXwUSu	A5XfPG0F327	rhN0iSUdaboSTFyabax93yb14K4TSyf	event	IDSR Was patient Vaccinated						f			\N	f		TEXT	patient vaccinated	A5XfPG0F327			Rt3ZfijCNSR	oIfXzXib4AE	\N	\N	\N
27	rhN0iSUdaboSTFyabax93yb14K4TSyf	1	Was Lab specimen taken?	options	[{"id":"NBgoNehp6nOY1R1IL5sYHO4FeLzUHeB","title":"Yes","response":"1","next_menu":"j1Bu0CFssKMzm35pRSFf1jbPrJt9W7w"},{"id":"RE3BTaLjiNSxa1d4JQwY8bvOq6aKHsn","title":"No","response":"2","next_menu":"2Neo1Fr0M6tGPrEpXblDwGn30RABpoC"}]	g8kJbzBm80c5VLHvKcKx4vfh33uJdyf										f			\N	f									\N	\N	\N
28	j1Bu0CFssKMzm35pRSFf1jbPrJt9W7w	1	IDSR Where was specimen sent	data	[{"id":"yGBNyTE3xsL","title":"Discarded","response":"1","value":"Discarded"},{"id":"Md8STGhrz8p","title":"District Lab","response":"2","value":"District Lab"},{"id":"NaADyB0u3XK","title":"National Lab","response":"3","value":"National Lab"},{"id":"YOPmcMcSc2D","title":"Regional Lab","response":"4","value":"Regional Lab"}]	rhN0iSUdaboSTFyabax93yb14K4TSyf	H8ZNJvNZaGK	C1jlzameM6Ki0EPgDxmlgYiFZwbiC38	event	IDSR Where was specimen sent						f			\N	f		TEXT	WhereSpecimenSent	H8ZNJvNZaGK			Rt3ZfijCNSR	oIfXzXib4AE	\N	\N	\N
29	C1jlzameM6Ki0EPgDxmlgYiFZwbiC38	1	Is Patient alive?	options	[{"id":"YDcf2JNNc4Gu5MBgJZungiQKwrbujqQ","title":"Yes","response":"1","next_menu":"Nj6Uf7HL7c8SU8CfTPbYvF1W0VtvOLv"},{"id":"8vsUz5lvbhVECy8EQ5a8xNUFMQFrjtZ","title":"No","response":"2","next_menu":"bk2a8crw0MaNXH5BKtgbYM4rdL7ldp5"}]	j1Bu0CFssKMzm35pRSFf1jbPrJt9W7w										f			\N	f									\N	\N	\N
30	2Neo1Fr0M6tGPrEpXblDwGn30RABpoC	1	Is Patient alive?	options	[{"id":"L8pPivPwTyehzK3RvcodEW3eivg6iks","title":"Yes","response":"1","next_menu":"rZ6Pd9nuzUSfsxyOVLQQeUEGgRoNCWJ"},{"id":"mlXtLeGxX0oy0Qgf0d0iPQ2sSdsctBO","title":"No","response":"2","next_menu":"UlKRfLrMgUsvpw5HzkIHytoCTYY5Zds"}]	rhN0iSUdaboSTFyabax93yb14K4TSyf										f			\N	f									\N	\N	\N
31	UlKRfLrMgUsvpw5HzkIHytoCTYY5Zds	1	IDSR Action Taken: Quarantine?	data	[{"id":"pmStNhxDqxcZkNsKZ1vAM3XOjztrljM","title":"Yes","response":"1","value":true},{"id":"2eLj26N5fCbBf5duWzgJwpn6HqGjvzX","title":"No","response":"2","value":false}]	2Neo1Fr0M6tGPrEpXblDwGn30RABpoC	DvIvLGska4L	zbO3SYfVx2XzRcRExVUtiofLngH886L	event	IDSR Action Taken: Quarantine?						f			\N	f		BOOLEAN	AT: Quarantine	DvIvLGska4L			Rt3ZfijCNSR	oIfXzXib4AE	\N	\N	\N
32	zbO3SYfVx2XzRcRExVUtiofLngH886L	1	IDSR Action Taken: Investigation	data	[{"id":"WS16vjx3D9JP3MBdvDQ1GNSAt8DnAcz","title":"No","response":"1","value":false},{"id":"8Gmzr5goddJb7fOJTHxkn48P2wnQfxD","title":"Yes","response":"2","value":true}]	UlKRfLrMgUsvpw5HzkIHytoCTYY5Zds	aBHgXkUZhBa	VAGyVqiIuRetuIzeGpyuwQ0NyMcwn1v	event	IDSR Action Taken: Investigation						f			\N	f		BOOLEAN	AT: Investigation	aBHgXkUZhBa			Rt3ZfijCNSR	oIfXzXib4AE	\N	\N	\N
33	rZ6Pd9nuzUSfsxyOVLQQeUEGgRoNCWJ	1	IDSR Patient status	data	[{"id":"anvzMd7xobk","title":"Admitted","response":"1","value":"Admitted"},{"id":"stoRl0yUgwO","title":"Discharged","response":"2","value":"Discharged"},{"id":"cQwAovxLRbn","title":"OPD","response":"3","value":"OPD"}]	2Neo1Fr0M6tGPrEpXblDwGn30RABpoC	QSFMWHHU1pk	coujZkcgtwMbn5bCFvd43cQkA0vd9x7	event	IDSR Patient status						f			\N	f		TEXT	Patient status	QSFMWHHU1pk			Rt3ZfijCNSR	oIfXzXib4AE	\N	\N	\N
34	Nj6Uf7HL7c8SU8CfTPbYvF1W0VtvOLv	1	IDSR Patient status	data	[{"id":"anvzMd7xobk","title":"Admitted","response":"1","value":"Admitted"},{"id":"stoRl0yUgwO","title":"Discharged","response":"2","value":"Discharged"},{"id":"cQwAovxLRbn","title":"OPD","response":"3","value":"OPD"}]	C1jlzameM6Ki0EPgDxmlgYiFZwbiC38	QSFMWHHU1pk	E5UVyCjVNr6dfGAWSbqPn1kVs1bKhvz	event	IDSR Patient status						f			\N	f		TEXT	Patient status	QSFMWHHU1pk			Rt3ZfijCNSR	oIfXzXib4AE	\N	\N	\N
35	E5UVyCjVNr6dfGAWSbqPn1kVs1bKhvz	1	IDSR Action Taken: Referred?	data	[{"id":"mo3q56uhdJUDqMrRG4VTswz6fZweh6A","title":"Yes","response":"1","value":true},{"id":"ht3Ul9naBnIZOfa5TZmliIQQegrCXxx","title":"No","response":"2","value":false}]	Nj6Uf7HL7c8SU8CfTPbYvF1W0VtvOLv	H0BGXB6ZBA6	3S5bhiRWaaauQIQiLan13zkl50M6Nb5	event	IDSR Action Taken: Referred?						f			\N	f		BOOLEAN	AT: Referred	H0BGXB6ZBA6			Rt3ZfijCNSR	oIfXzXib4AE	\N	\N	\N
36	3S5bhiRWaaauQIQiLan13zkl50M6Nb5	1	IDSR Action Taken: Admitted?	data	[{"id":"y2VrOzKZCbBfdNyXxZ9UxZLObfYDj3K","title":"Yes","response":"1","value":true},{"id":"b1yNCD1x32Mv622qj4PfXZ2tNEk1ltp","title":"No","response":"2","value":false}]	E5UVyCjVNr6dfGAWSbqPn1kVs1bKhvz	v6BYZIjbQ5l	Foc1B8ZUaSQSnBSpGWoaDpEsJ3kIZ0m	event	IDSR Action Taken: Admitted?						f			\N	f		BOOLEAN	AT: Admitted?	v6BYZIjbQ5l			Rt3ZfijCNSR	oIfXzXib4AE	\N	\N	\N
37	Foc1B8ZUaSQSnBSpGWoaDpEsJ3kIZ0m	1	IDSR Action Taken: Quarantine?	data	[{"id":"meZ7fINTPfS6oUovVxlNFAM7DDv5Egq","title":"Yes","response":"1","value":true},{"id":"Vy7ncjNQryI1ho0BWMnjfi1aK58WNBq","title":"No","response":"2","value":false}]	3S5bhiRWaaauQIQiLan13zkl50M6Nb5	DvIvLGska4L	ldIOj5rJHsCesU7Uf1LhPSXWNfatvzK	event	IDSR Action Taken: Quarantine?						f			\N	f		BOOLEAN	AT: Quarantine	DvIvLGska4L			Rt3ZfijCNSR	oIfXzXib4AE	\N	\N	\N
38	ldIOj5rJHsCesU7Uf1LhPSXWNfatvzK	1	IDSR Action Taken: Investigation	data	[{"id":"3ElbpN9XFNVNVyTVTN2kmTNCFCpcozB","title":"Yes","response":"1","value":true},{"id":"hPbEYIuh1Py3xzFoMCi8vD22xbUzs4U","title":"No","response":"2","value":false}]	Foc1B8ZUaSQSnBSpGWoaDpEsJ3kIZ0m	aBHgXkUZhBa	CJJwW7BVneobqkwp1zuf8CEmnhMSmK2	event	IDSR Action Taken: Investigation						f			\N	f		BOOLEAN	AT: Investigation	aBHgXkUZhBa			Rt3ZfijCNSR	oIfXzXib4AE	\N	\N	\N
39	CJJwW7BVneobqkwp1zuf8CEmnhMSmK2	1	IDSR Action Taken: Contact Tracing	data	[{"id":"iEAHAA7zZdOnv8i9e8fARqw50QeX1tO","title":"Yes","response":"1","value":true},{"id":"yYujVcig5LowB5OGaz5cX0NjqXdg7EI","title":"No","response":"2","value":false}]	ldIOj5rJHsCesU7Uf1LhPSXWNfatvzK	x3bB0bwXUxf	uC5M0pY3LDEf3n0giiB6q8ka7ONOLMl	event	IDSR Action Taken: Contact Tracing						f			\N	f		BOOLEAN	AT: Cont tracing	x3bB0bwXUxf			Rt3ZfijCNSR	oIfXzXib4AE	\N	\N	\N
159	wQojhtNEczGF0BIMEsMIhMbwg6hJF2b	1	Thanks data captured and saved	message	[]	nqToOwNzB33kCE9aoC1v91UcKDZIjQ4										f			\N	f									\N	\N	\N
40	uC5M0pY3LDEf3n0giiB6q8ka7ONOLMl	1	You're about to send data to eIDSR system, Please press	options	[{"id":"byoKThQFNYHIrb46E2rxDVFnicwLtgS","title":"Submit","response":"1","next_menu":"R3QPNOUDPfKslUsoM7lSl4NG6ldwisF"},{"id":"CnMmjGXlu8di5MpY6Bx9xOJK45MaZJE","title":"Cancel","response":"2","next_menu":""}]	CJJwW7BVneobqkwp1zuf8CEmnhMSmK2										f			\N	f									\N	\N	\N
41	R3QPNOUDPfKslUsoM7lSl4NG6ldwisF	1	Thanks data captured and saved.	message	[]	uC5M0pY3LDEf3n0giiB6q8ka7ONOLMl										f			\N	f									\N	\N	\N
42	bk2a8crw0MaNXH5BKtgbYM4rdL7ldp5	1	IDSR Action Taken: Quarantine?	data	[{"id":"OJgt7xnS2HLsnqlLtZnlzDtbxBoRfr2","title":"No","response":"1","value":false},{"id":"PWyc6O1OlAL3Yia4814AEOZWFLmgfq4","title":"Yes","response":"2","value":true}]	C1jlzameM6Ki0EPgDxmlgYiFZwbiC38	DvIvLGska4L	LipLlKfwfiAvPFY0n6wjzUrCYmCmgkU	event	IDSR Action Taken: Quarantine?						f			\N	f		BOOLEAN	AT: Quarantine	DvIvLGska4L			Rt3ZfijCNSR	oIfXzXib4AE	\N	\N	\N
43	LipLlKfwfiAvPFY0n6wjzUrCYmCmgkU	1	IDSR Action Taken: Investigation	data	[{"id":"QMqHAtgeJTsaiXNrWKM22gIS0wBnr13","title":"No","response":"1","value":false},{"id":"BxxNNHUBCti8M6s2JFNA6huep7KfwLT","title":"Yes","response":"2","value":true}]	bk2a8crw0MaNXH5BKtgbYM4rdL7ldp5	aBHgXkUZhBa	pOW5aOQdHs3tgnQwgSw4zf48rCFsoNe	event	IDSR Action Taken: Investigation						f			\N	f		BOOLEAN	AT: Investigation	aBHgXkUZhBa			Rt3ZfijCNSR	oIfXzXib4AE	\N	\N	\N
44	pOW5aOQdHs3tgnQwgSw4zf48rCFsoNe	1	IDSR Action Taken: Contact Tracing	data	[{"id":"fzCHiEEBP6UnnJvXoXEfPfhn2lZdhff","title":"No","response":"1","value":false},{"id":"PaNFkikS45w8Mnlx5Jq1MowCMjtZmmH","title":"Yes","response":"2","value":true}]	LipLlKfwfiAvPFY0n6wjzUrCYmCmgkU	x3bB0bwXUxf	XV3DY2xGZ4Oz5SGBNw1RABqtdRpB2Gq	event	IDSR Action Taken: Contact Tracing						f			\N	f		BOOLEAN	AT: Cont tracing	x3bB0bwXUxf			Rt3ZfijCNSR	oIfXzXib4AE	\N	\N	\N
45	XV3DY2xGZ4Oz5SGBNw1RABqtdRpB2Gq	1	You're about to send data to eIDSR system, Please press	options	[{"id":"Ia3EzrAKlgp363qMkPxDS6hyxaDrufF","title":"Submit","response":"1","next_menu":"ABb6vTXQTg3p7O6UNha2QQdoQIqigmj"},{"id":"PvilrrRDDZZWtUxUd2kIU1QjCOGsCsn","title":"Cancel","response":"2","next_menu":""}]	pOW5aOQdHs3tgnQwgSw4zf48rCFsoNe										f			\N	f									\N	\N	\N
46	ABb6vTXQTg3p7O6UNha2QQdoQIqigmj	1	Thanks data captured and saved. 	message	[]	XV3DY2xGZ4Oz5SGBNw1RABqtdRpB2Gq										f			\N	f									\N	\N	\N
47	VAGyVqiIuRetuIzeGpyuwQ0NyMcwn1v	1	IDSR Action Taken: Contact Tracing	data	[{"id":"zjkIdC3dKYOJu6mCUjPAt3GaSa1VoX1","title":"No","response":"1","value":false},{"id":"3URllswUAfnCmxIdnzqE67Pzptsd8jl","title":"Yes","response":"2","value":true}]	zbO3SYfVx2XzRcRExVUtiofLngH886L	x3bB0bwXUxf	03Qfv9ByL7OgwcdHLsReMJVDTGXlbtL	event	IDSR Action Taken: Contact Tracing						f			\N	f		BOOLEAN	AT: Cont tracing	x3bB0bwXUxf			Rt3ZfijCNSR	oIfXzXib4AE	\N	\N	\N
48	03Qfv9ByL7OgwcdHLsReMJVDTGXlbtL	1	You're about to send data to eIDSR system, Please press	options	[{"id":"cRhVS8he7au4P35yXLMFY9m59wzAfAK","title":"Submit","response":"1","next_menu":"gzinxX6CPZNK4NTNRlWLIe7WnYivqJv"},{"id":"1SIMRCAfnshVO5j6bPfVUgoVhwia6D4","title":"Cancel","response":"2","next_menu":""}]	VAGyVqiIuRetuIzeGpyuwQ0NyMcwn1v										f			\N	f									\N	\N	\N
49	gzinxX6CPZNK4NTNRlWLIe7WnYivqJv	1	Thanks data captured and saved	message	[]	03Qfv9ByL7OgwcdHLsReMJVDTGXlbtL										f			\N	f									\N	\N	\N
50	coujZkcgtwMbn5bCFvd43cQkA0vd9x7	1	IDSR Action Taken: Referred?	data	[{"id":"VwoHzmrwrV8kCHneWZUUSIMBtY3DSR2","title":"No","response":"1","value":false},{"id":"CsyOaB46P3qKWUbgI1hE5FZofWNBvmD","title":"Yes","response":"2","value":true}]	rZ6Pd9nuzUSfsxyOVLQQeUEGgRoNCWJ	H0BGXB6ZBA6	7h6nsNSRNYVfrxiT0ZxxZ8puWPvbmT1	event	IDSR Action Taken: Referred?						f			\N	f		BOOLEAN	AT: Referred	H0BGXB6ZBA6			Rt3ZfijCNSR	oIfXzXib4AE	\N	\N	\N
51	7h6nsNSRNYVfrxiT0ZxxZ8puWPvbmT1	1	IDSR Action Taken: Admitted?	data	[{"id":"i9pXNn22P0BBjGZZ4Xwg72vmuhdqJEn","title":"No","response":"1","value":false},{"id":"sQEqXzv0U6weIRQXfD02wziZoEd6drg","title":"Yes","response":"2","value":true}]	coujZkcgtwMbn5bCFvd43cQkA0vd9x7	v6BYZIjbQ5l	7gM8MvvxuyFrnpN4XRvu17079eUCnKx	event	IDSR Action Taken: Admitted?						f			\N	f		BOOLEAN	AT: Admitted?	v6BYZIjbQ5l			Rt3ZfijCNSR	oIfXzXib4AE	\N	\N	\N
52	7gM8MvvxuyFrnpN4XRvu17079eUCnKx	1	IDSR Action Taken: Quarantine?	data	[{"id":"t0IKfV98gqnEOYW4179OKYhQIDtn6Zi","title":"No","response":"1","value":false},{"id":"NihKbJByc27f3bMq4UQF2USk1PH3ZeS","title":"Yes","response":"2","value":true}]	7h6nsNSRNYVfrxiT0ZxxZ8puWPvbmT1	DvIvLGska4L	vqaKffMO6SczXzupFcb9CoCT3vlBOAg	event	IDSR Action Taken: Quarantine?						f			\N	f		BOOLEAN	AT: Quarantine	DvIvLGska4L			Rt3ZfijCNSR	oIfXzXib4AE	\N	\N	\N
53	vqaKffMO6SczXzupFcb9CoCT3vlBOAg	1	IDSR Action Taken: Investigation	data	[{"id":"g99YK1HF5rO4f1L174xrGrTAYpHvPIs","title":"No","response":"1","value":false},{"id":"VsQR4sRfpPW0TsJDoPlbS4BK86fBGJq","title":"Yes","response":"2","value":true}]	7gM8MvvxuyFrnpN4XRvu17079eUCnKx	aBHgXkUZhBa	6LurbyglTAYUlmNWhmQ38u7yIcrK1JF	event	IDSR Action Taken: Investigation						f			\N	f		BOOLEAN	AT: Investigation	aBHgXkUZhBa			Rt3ZfijCNSR	oIfXzXib4AE	\N	\N	\N
54	6LurbyglTAYUlmNWhmQ38u7yIcrK1JF	1	IDSR Action Taken: Contact Tracing	data	[{"id":"lLajkFqalJ9XG9Fj6HkKTpz4Flg9soh","title":"No","response":"1","value":false},{"id":"sJpF73rOoKa5CIjPW3r4zWVI36VTrLw","title":"Yes","response":"2","value":true}]	vqaKffMO6SczXzupFcb9CoCT3vlBOAg	x3bB0bwXUxf	AWWRop5qLE6XauCG28WevMyHNfZh5CU	event	IDSR Action Taken: Contact Tracing						f			\N	f		BOOLEAN	AT: Cont tracing	x3bB0bwXUxf			Rt3ZfijCNSR	oIfXzXib4AE	\N	\N	\N
55	AWWRop5qLE6XauCG28WevMyHNfZh5CU	1	You're about to send data to eIDSR system, Please press	options	[{"id":"nUHroCbIxX3uSQlhaocluNx2bpLhqJ9","title":"Submit","response":"1","next_menu":"6MplkZT6incKi1U5cTF4Of59dRsTbnF"},{"id":"jrfgvqAIIUXdOIYJs7It4Wdu9KlkJZZ","title":"Cancel","response":"2","next_menu":""}]	6LurbyglTAYUlmNWhmQ38u7yIcrK1JF										f			\N	f									\N	\N	\N
56	6MplkZT6incKi1U5cTF4Of59dRsTbnF	1	Thanks data captured and saved	message	[]	AWWRop5qLE6XauCG28WevMyHNfZh5CU										f			\N	f									\N	\N	\N
57	wqWDV3TIP1xwAYMzXQ3SoV3oieXLUW3	1	IDSR Disease	data	[{"id":"Gxw7uw4owZn","title":"B05.9-Measles ","response":"1","value":"B05.9-Measles "},{"id":"F9sKDzneaFX","title":"Human influenza caused by new subtypes","response":"2","value":"Human influenza caused by new subtypes"},{"id":"wzixoWuc1le","title":"Maternal Death","response":"3","value":"Maternal Death"},{"id":"LSAaYcnYnkr","title":"Neonatal Tetanus","response":"4","value":"Neonatal Tetanus"},{"id":"e5HRQS2bRV3","title":"Plague","response":"5","value":"Plague"}]	NVd4wtTY1i4sYAtMJzedU1EXfblkd2n	Of2oRqwosOB	zZ3cWhf74PAovhfyRAMEcjWzMUbIwUY	event	IDSR Disease						f			\N	f		TEXT	Disease	Of2oRqwosOB			Rt3ZfijCNSR	oIfXzXib4AE	\N	\N	\N
58	zZ3cWhf74PAovhfyRAMEcjWzMUbIwUY	1	IDSR Number of days since symptoms	data	[]	wqWDV3TIP1xwAYMzXQ3SoV3oieXLUW3	VhU1TQa5hJV	GQYmrt8KelF8PxbJRxTd6Y5ePvyo27Z	event	IDSR Number of days since symptoms						f			\N	f		INTEGER_POSITIVE	Days since symptoms	VhU1TQa5hJV			Rt3ZfijCNSR	oIfXzXib4AE	\N	\N	\N
59	GQYmrt8KelF8PxbJRxTd6Y5ePvyo27Z	1	Age Type	data	[{"id":"gROcyTVfL8h","title":"Days","response":"1","value":"Days"},{"id":"vW2sozl2oPn","title":"Months","response":"2","value":"Months"},{"id":"zpdLUDfUUxt","title":"Years","response":"3","value":"Years"}]	zZ3cWhf74PAovhfyRAMEcjWzMUbIwUY	JJkV68Devly	lE0lsWD8qkH1ZFMPlsz7Hj83KamSUEJ	event	Age Type						f			\N	f		TEXT	Age Type	JJkV68Devly			Rt3ZfijCNSR	oIfXzXib4AE	\N	\N	\N
61	eBmIelvfjpi0kFIYMyMy4e91m6A4Yhc	1	Select disease	options	[{"id":"Xxoa65ruWYc7VVzMFxEcpxs26IpJaxF","title":"Animal bites","response":"1","next_menu":"z2dZ46BphywELHdBBLQEfYdVp8gcajs"},{"id":"oWUaQideUMofj3HsSvHJUo9yGLsyUvG","title":"Diarrhoea","response":"2","next_menu":"e6esp7xyZ5nOpdDM2I3Cq16Fm8rCJNd"},{"id":"TFvrXYfOsjefeqggamR2iR0A6oSmwBY","title":"Malnutrition","response":"3","next_menu":"4F7MZ5HgvW0OYvVGdoKNVUkpGee4N2n"},{"id":"ZmGjgGabNqQsw7wNnfZKs73DM2hHIvw","title":"Onchocerciasis","response":"4","next_menu":"9ZqlLgBjo8TVFFES9GaBf8jDQ7t7HRR"},{"id":"X25qmdu0H6u2aTsYQgR58RkdcTux8aC","title":"Pneumonia","response":"5","next_menu":"GoQsYlb6VqpgXCowhoFQCI7MZQCDHyi"},{"id":"pymCkCVidh0MStlGQjhJv2VSLutQh5T","title":"Tick borne r.fever","response":"6","next_menu":"VJ4dqgbMn74sG3ZkbobVWDJUR68G5UG"},{"id":"nuQsJEl7v2BYc4oBNfSjrYz7Dm2B8vH","title":"Trachoma","response":"7","next_menu":"ULc6WxXAQ0lYe5kIF0OaQ5EgvoZCMLG"},{"id":"xvq62Dg0SmXtpazuaCFjnYolDPmhrKL","title":"Trypanosomiasis","response":"8","next_menu":"cvWqFGJB6cKKx1tz51xL6OQmyXVnEax"},{"id":"1pSobKg2wdLTZCRG5tKsSy227tFUrqV","title":"Typhoid","response":"9","next_menu":"mjXZaHKtKHp76yHLsP5RWc9uD6ijjNY"}]	vS1HlGTUeDwps5JivGLRxGQEXdLBv5G										f			\N	f									\N	\N	\N
62	z2dZ46BphywELHdBBLQEfYdVp8gcajs	1	IDSR Animal Bites Case, < 5, ME	data	[]	eBmIelvfjpi0kFIYMyMy4e91m6A4Yhc	nrmGMpeTMpK.AttDwO4xCIu	Wafhz7GOrVIndHUKmiJwh2WnMEsindG	aggregate	IDSR Animal Bites Case, < 5, ME						f			\N	f		INTEGER_ZERO_OR_POSITIVE	Animal Bites Case < 5 ME	nrmGMpeTMpK	AttDwO4xCIu				\N	\N	\N
63	Wafhz7GOrVIndHUKmiJwh2WnMEsindG	1	IDSR Animal Bites Case, < 5, KE	data	[]	z2dZ46BphywELHdBBLQEfYdVp8gcajs	nrmGMpeTMpK.QInmZugn9JO	SqkogBBM1X2wcsH2ylFQ6QKH58hzInC	aggregate	IDSR Animal Bites Case, < 5, KE						f			\N	f		INTEGER_ZERO_OR_POSITIVE	Animal Bites Case < 5 KE	nrmGMpeTMpK	QInmZugn9JO				\N	\N	\N
64	SqkogBBM1X2wcsH2ylFQ6QKH58hzInC	1	IDSR Animal Bites Death , < 5, ME	data	[]	Wafhz7GOrVIndHUKmiJwh2WnMEsindG	nrmGMpeTMpK.LZsl9VW71qr	0FACh4cxvDlHOkH2kePFjVKXpFiHQ0n	aggregate	IDSR Animal Bites Death , < 5, ME						f			\N	f		INTEGER_ZERO_OR_POSITIVE	Animal Bites Death < 5 ME	nrmGMpeTMpK	LZsl9VW71qr				\N	\N	\N
65	0FACh4cxvDlHOkH2kePFjVKXpFiHQ0n	1	IDSR Animal Bites Death , < 5, KE	data	[]	SqkogBBM1X2wcsH2ylFQ6QKH58hzInC	nrmGMpeTMpK.ifRTBcyGzHU	iBlMD0aUtADJV5YWygFbBMuJqlmWgca	aggregate	IDSR Animal Bites Death , < 5, KE						f			\N	f		INTEGER_ZERO_OR_POSITIVE	Animal Bites Death < 5 KE	nrmGMpeTMpK	ifRTBcyGzHU				\N	\N	\N
66	iBlMD0aUtADJV5YWygFbBMuJqlmWgca	1	IDSR Animal Bites Case, > 5, ME	data	[]	0FACh4cxvDlHOkH2kePFjVKXpFiHQ0n	nrmGMpeTMpK.FRzeEpefSK8	pYudeGeWliSPshiHCzAhBnVCOocI1a9	aggregate	IDSR Animal Bites Case, > 5, ME						f			\N	f		INTEGER_ZERO_OR_POSITIVE	Animal Bites Case > 5 ME	nrmGMpeTMpK	FRzeEpefSK8				\N	\N	\N
67	pYudeGeWliSPshiHCzAhBnVCOocI1a9	1	IDSR Animal Bites Case, > 5, KE	data	[]	iBlMD0aUtADJV5YWygFbBMuJqlmWgca	nrmGMpeTMpK.q3GdT7f6iw9	C5ATi5x5l3j6pvMwCFuJ5uTja4TmXOq	aggregate	IDSR Animal Bites Case, > 5, KE						f			\N	f		INTEGER_ZERO_OR_POSITIVE	Animal Bites Case > 5 KE	nrmGMpeTMpK	q3GdT7f6iw9				\N	\N	\N
68	C5ATi5x5l3j6pvMwCFuJ5uTja4TmXOq	1	IDSR Animal Bites Death , > 5, ME	data	[]	pYudeGeWliSPshiHCzAhBnVCOocI1a9	nrmGMpeTMpK.lW9u3eKdMXH	eJ6FQRSivmddl97vJCkP4qtxcHfxvkg	aggregate	IDSR Animal Bites Death , > 5, ME						f			\N	f		INTEGER_ZERO_OR_POSITIVE	Animal Bites Death > 5 ME	nrmGMpeTMpK	lW9u3eKdMXH				\N	\N	\N
69	eJ6FQRSivmddl97vJCkP4qtxcHfxvkg	1	IDSR Animal Bites Death , > 5, KE	data	[]	C5ATi5x5l3j6pvMwCFuJ5uTja4TmXOq	nrmGMpeTMpK.Q8U3fXSfxY8	jHScMM6895oTgQR4KAGavvGpcflLtmv	aggregate	IDSR Animal Bites Death , > 5, KE						f			\N	f		INTEGER_ZERO_OR_POSITIVE	Animal Bites Death > 5 KE	nrmGMpeTMpK	Q8U3fXSfxY8				\N	\N	\N
70	jHScMM6895oTgQR4KAGavvGpcflLtmv	1	You're about to send data to eIDSR system, Please press\n	options	[{"id":"iKW8RPkDM2ng5wGLHt6B6u7hlINu2rf","title":"Confirm","response":"1","next_menu":"xvvRrnbEbU84DxLsAvPKJj4tN5qWgfA"},{"id":"VSOPEpZHRxBJwXpeGO9sL3r90ZTUTNO","title":"Cancel","response":"2","next_menu":""}]	eJ6FQRSivmddl97vJCkP4qtxcHfxvkg										f			\N	f									\N	\N	\N
71	xvvRrnbEbU84DxLsAvPKJj4tN5qWgfA	1	Thanks data captured and saved	message	[]	jHScMM6895oTgQR4KAGavvGpcflLtmv										f			\N	f									\N	\N	\N
72	e6esp7xyZ5nOpdDM2I3Cq16Fm8rCJNd	1	IDSR Diarrhoea <5 Years Case, < 5, ME	data	[]	eBmIelvfjpi0kFIYMyMy4e91m6A4Yhc	kXD4hg575gJ.AttDwO4xCIu	3vpKy85mNpjiH1CUVAgDmwEuVtoKOBf	aggregate	IDSR Diarrhoea <5 Years Case, < 5, ME						f			\N	f		INTEGER_ZERO_OR_POSITIVE	Diarrhoea Case < 5 ME	kXD4hg575gJ	AttDwO4xCIu				\N	\N	\N
73	3vpKy85mNpjiH1CUVAgDmwEuVtoKOBf	1	IDSR Diarrhoea <5 Years Case, < 5, KE	data	[]	e6esp7xyZ5nOpdDM2I3Cq16Fm8rCJNd	kXD4hg575gJ.QInmZugn9JO	QDURR8Z3DpSWgfS8z3NDe9UOK4bTH1h	aggregate	IDSR Diarrhoea <5 Years Case, < 5, KE						f			\N	f		INTEGER_ZERO_OR_POSITIVE	Diarrhoea Case < 5 KE	kXD4hg575gJ	QInmZugn9JO				\N	\N	\N
74	QDURR8Z3DpSWgfS8z3NDe9UOK4bTH1h	1	IDSR Diarrhoea <5 Years Death , < 5, ME	data	[]	3vpKy85mNpjiH1CUVAgDmwEuVtoKOBf	kXD4hg575gJ.LZsl9VW71qr	ORLu44XAQHqsB2skQZMUlCG6NRrO2uG	aggregate	IDSR Diarrhoea <5 Years Death , < 5, ME						f			\N	f		INTEGER_ZERO_OR_POSITIVE	Diarrhoea Death < 5 ME	kXD4hg575gJ	LZsl9VW71qr				\N	\N	\N
75	ORLu44XAQHqsB2skQZMUlCG6NRrO2uG	1	IDSR Diarrhoea <5 Years Death , < 5, KE	data	[]	QDURR8Z3DpSWgfS8z3NDe9UOK4bTH1h	kXD4hg575gJ.ifRTBcyGzHU	pXDjI9G9ZuKknmaj0YceVImDQtowfGe	aggregate	IDSR Diarrhoea <5 Years Death , < 5, KE						f			\N	f		INTEGER_ZERO_OR_POSITIVE	Diarrhoea Death < 5 KE	kXD4hg575gJ	ifRTBcyGzHU				\N	\N	\N
76	pXDjI9G9ZuKknmaj0YceVImDQtowfGe	1	You're about to send data to eIDSR system, Please press	options	[{"id":"ONHRpDcgLeWL6VbARLlNiFZUvBX0n1t","title":"Confirm","response":"1","next_menu":"TuiWAnf8fLwaVcHZk7tPdDMdcEjeZny"},{"id":"oeL7oxhDGmr5J6DfUK6rnUEUYcrR1Jr","title":"Cancel","response":"2","next_menu":"qK75IbUJp4MnU2xquClJhyFjkOOskEi"}]	ORLu44XAQHqsB2skQZMUlCG6NRrO2uG										f			\N	f									\N	\N	\N
77	TuiWAnf8fLwaVcHZk7tPdDMdcEjeZny	1	Thanks data captured and saved 	message	[]	pXDjI9G9ZuKknmaj0YceVImDQtowfGe										f			\N	f									\N	\N	\N
78	qK75IbUJp4MnU2xquClJhyFjkOOskEi	1	Request cancelled	message	[]	pXDjI9G9ZuKknmaj0YceVImDQtowfGe										f			\N	f									\N	\N	\N
79	4F7MZ5HgvW0OYvVGdoKNVUkpGee4N2n	1	IDSR Malnutrition Case, < 5, ME	data	[]	eBmIelvfjpi0kFIYMyMy4e91m6A4Yhc	R9LUB5mvxCO.AttDwO4xCIu	NRBMJgw4m5TsRFAqdHztZXRTIks95TJ	aggregate	IDSR Malnutrition Case, < 5, ME						f			\N	f		INTEGER_ZERO_OR_POSITIVE	Malnutrition Case < 5 ME	R9LUB5mvxCO	AttDwO4xCIu				\N	\N	\N
80	NRBMJgw4m5TsRFAqdHztZXRTIks95TJ	1	IDSR Malnutrition Case, < 5, KE	data	[]	4F7MZ5HgvW0OYvVGdoKNVUkpGee4N2n	R9LUB5mvxCO.QInmZugn9JO	U1OOITGYcGPPIKXeKXammzvZCgeuRr0	aggregate	IDSR Malnutrition Case, < 5, KE						f			\N	f		INTEGER_ZERO_OR_POSITIVE	Malnutrition Case < 5 KE	R9LUB5mvxCO	QInmZugn9JO				\N	\N	\N
81	U1OOITGYcGPPIKXeKXammzvZCgeuRr0	1	IDSR Malnutrition Death , < 5, ME	data	[]	NRBMJgw4m5TsRFAqdHztZXRTIks95TJ	R9LUB5mvxCO.LZsl9VW71qr	rDSfdP6KwXlXNuBJypmYNjWiaN63XWa	aggregate	IDSR Malnutrition Death , < 5, ME						f			\N	f		INTEGER_ZERO_OR_POSITIVE	Malnutrition Death < 5 ME	R9LUB5mvxCO	LZsl9VW71qr				\N	\N	\N
82	rDSfdP6KwXlXNuBJypmYNjWiaN63XWa	1	IDSR Malnutrition Death , < 5, KE	data	[]	U1OOITGYcGPPIKXeKXammzvZCgeuRr0	R9LUB5mvxCO.ifRTBcyGzHU	rtwTIlB6vMvoHTocVbXNCbH8TbIpOGM	aggregate	IDSR Malnutrition Death , < 5, KE						f			\N	f		INTEGER_ZERO_OR_POSITIVE	Malnutrition Death < 5 KE	R9LUB5mvxCO	ifRTBcyGzHU				\N	\N	\N
83	rtwTIlB6vMvoHTocVbXNCbH8TbIpOGM	1	IDSR Malnutrition Case, > 5, ME	data	[]	rDSfdP6KwXlXNuBJypmYNjWiaN63XWa	R9LUB5mvxCO.FRzeEpefSK8	2JgEMidFKpsAtNLeNq2CBqRpHO5W1CB	aggregate	IDSR Malnutrition Case, > 5, ME						f			\N	f		INTEGER_ZERO_OR_POSITIVE	Malnutrition Case > 5 ME	R9LUB5mvxCO	FRzeEpefSK8				\N	\N	\N
84	2JgEMidFKpsAtNLeNq2CBqRpHO5W1CB	1	IDSR Malnutrition Case, > 5, KE	data	[]	rtwTIlB6vMvoHTocVbXNCbH8TbIpOGM	R9LUB5mvxCO.q3GdT7f6iw9	5TIcRXGakxYes9tQI7v0NbkoBpflZv2	aggregate	IDSR Malnutrition Case, > 5, KE						f			\N	f		INTEGER_ZERO_OR_POSITIVE	Malnutrition Case > 5 KE	R9LUB5mvxCO	q3GdT7f6iw9				\N	\N	\N
85	5TIcRXGakxYes9tQI7v0NbkoBpflZv2	1	IDSR Malnutrition Death , > 5, ME	data	[]	2JgEMidFKpsAtNLeNq2CBqRpHO5W1CB	R9LUB5mvxCO.lW9u3eKdMXH	jSk3zfXdlQf96IVfK4Mx0kRt3eqjCNu	aggregate	IDSR Malnutrition Death , > 5, ME						f			\N	f		INTEGER_ZERO_OR_POSITIVE	Malnutrition Death > 5 ME	R9LUB5mvxCO	lW9u3eKdMXH				\N	\N	\N
86	jSk3zfXdlQf96IVfK4Mx0kRt3eqjCNu	1	IDSR Malnutrition Death , > 5, KE	data	[]	5TIcRXGakxYes9tQI7v0NbkoBpflZv2	R9LUB5mvxCO.Q8U3fXSfxY8	7t89av9bVWI0ndjrsPhxPt0yj694dkN	aggregate	IDSR Malnutrition Death , > 5, KE						f			\N	f		INTEGER_ZERO_OR_POSITIVE	Malnutrition Death > 5 KE	R9LUB5mvxCO	Q8U3fXSfxY8				\N	\N	\N
87	7t89av9bVWI0ndjrsPhxPt0yj694dkN	1	You're about to send data to eIDSR system, Please press 	options	[{"id":"zgSAYJMDnGxDAhI2qu2mY7cJaJt318E","title":"Confirm","response":"1","next_menu":"pHmB2o2J1RgAMXux54Tts23ZQ6vQGxO"},{"id":"aH0tQMU6yDY0JX7Arrs6g3hE8CpFy93","title":"Cancel","response":"2","next_menu":"acxVb0tXYfAXoZ04T65N2a48p8z7yNn"}]	jSk3zfXdlQf96IVfK4Mx0kRt3eqjCNu										f			\N	f									\N	\N	\N
88	pHmB2o2J1RgAMXux54Tts23ZQ6vQGxO	1	Thanks data captured and saved	message	[]	7t89av9bVWI0ndjrsPhxPt0yj694dkN										f			\N	f									\N	\N	\N
89	acxVb0tXYfAXoZ04T65N2a48p8z7yNn	1	Request cancelled	message	[]	7t89av9bVWI0ndjrsPhxPt0yj694dkN										f			\N	f									\N	\N	\N
90	9ZqlLgBjo8TVFFES9GaBf8jDQ7t7HRR	1	IDSR Onchocerciasis Case, < 5, ME	data	[]	eBmIelvfjpi0kFIYMyMy4e91m6A4Yhc	J2QRKPggvRC.AttDwO4xCIu	WK7sWbjuUHn6tk9hKI9cmGWR8n6Wffc	aggregate	IDSR Onchocerciasis Case, < 5, ME						f			\N	f		INTEGER_ZERO_OR_POSITIVE	Onchocerciasis Case < 5 ME	J2QRKPggvRC	AttDwO4xCIu				\N	\N	\N
91	WK7sWbjuUHn6tk9hKI9cmGWR8n6Wffc	1	IDSR Onchocerciasis Case, < 5, KE	data	[]	9ZqlLgBjo8TVFFES9GaBf8jDQ7t7HRR	J2QRKPggvRC.QInmZugn9JO	hxbBaOJN4X2nr1gq5DMxSGIbPUV0XKu	aggregate	IDSR Onchocerciasis Case, < 5, KE						f			\N	f		INTEGER_ZERO_OR_POSITIVE	Onchocerciasis Case < 5 KE	J2QRKPggvRC	QInmZugn9JO				\N	\N	\N
92	hxbBaOJN4X2nr1gq5DMxSGIbPUV0XKu	1	IDSR Onchocerciasis Death , < 5, ME	data	[]	WK7sWbjuUHn6tk9hKI9cmGWR8n6Wffc	J2QRKPggvRC.LZsl9VW71qr	8i5Y4XTTaoVthDK0n8pmvwqwoPVvnuf	aggregate	IDSR Onchocerciasis Death , < 5, ME						f			\N	f		INTEGER_ZERO_OR_POSITIVE	Onchocerciasis Death < 5 ME	J2QRKPggvRC	LZsl9VW71qr				\N	\N	\N
93	8i5Y4XTTaoVthDK0n8pmvwqwoPVvnuf	1	IDSR Onchocerciasis Death , < 5, KE	data	[]	hxbBaOJN4X2nr1gq5DMxSGIbPUV0XKu	J2QRKPggvRC.ifRTBcyGzHU	CEFUYbAAgQbQpZIzeRMaCSBQnIgP9FK	aggregate	IDSR Onchocerciasis Death , < 5, KE						f			\N	f		INTEGER_ZERO_OR_POSITIVE	Onchocerciasis Death < 5 KE	J2QRKPggvRC	ifRTBcyGzHU				\N	\N	\N
94	CEFUYbAAgQbQpZIzeRMaCSBQnIgP9FK	1	IDSR Onchocerciasis Case, > 5, ME	data	[]	8i5Y4XTTaoVthDK0n8pmvwqwoPVvnuf	J2QRKPggvRC.FRzeEpefSK8	Wpny0gz6ep4tJqSOeu4evMhE3NF9MSw	aggregate	IDSR Onchocerciasis Case, > 5, ME						f			\N	f		INTEGER_ZERO_OR_POSITIVE	Onchocerciasis Case > 5 ME	J2QRKPggvRC	FRzeEpefSK8				\N	\N	\N
95	Wpny0gz6ep4tJqSOeu4evMhE3NF9MSw	1	IDSR Onchocerciasis Case, > 5, KE	data	[]	CEFUYbAAgQbQpZIzeRMaCSBQnIgP9FK	J2QRKPggvRC.q3GdT7f6iw9	jNmcJA8R72QD1fkA01An7BuILaMSPMO	aggregate	IDSR Onchocerciasis Case, > 5, KE						f			\N	f		INTEGER_ZERO_OR_POSITIVE	Onchocerciasis Case > 5 KE	J2QRKPggvRC	q3GdT7f6iw9				\N	\N	\N
96	jNmcJA8R72QD1fkA01An7BuILaMSPMO	1	IDSR Onchocerciasis Death , > 5, ME	data	[]	Wpny0gz6ep4tJqSOeu4evMhE3NF9MSw	J2QRKPggvRC.lW9u3eKdMXH	jHVQbn9KSlPJRxfqfNB969GkpFZytzS	aggregate	IDSR Onchocerciasis Death , > 5, ME						f			\N	f		INTEGER_ZERO_OR_POSITIVE	Onchocerciasis Death > 5 ME	J2QRKPggvRC	lW9u3eKdMXH				\N	\N	\N
97	jHVQbn9KSlPJRxfqfNB969GkpFZytzS	1	IDSR Onchocerciasis Death , > 5, KE	data	[]	jNmcJA8R72QD1fkA01An7BuILaMSPMO	J2QRKPggvRC.Q8U3fXSfxY8	WwCg46lxUQVaxsgt1ZSXJhV8wtF0mUa	aggregate	IDSR Onchocerciasis Death , > 5, KE						f			\N	f		INTEGER_ZERO_OR_POSITIVE	Onchocerciasis Death > 5 KE	J2QRKPggvRC	Q8U3fXSfxY8				\N	\N	\N
98	WwCg46lxUQVaxsgt1ZSXJhV8wtF0mUa	1	You're about to send data to eIDSR system, Please press	options	[{"id":"iZaTiIRDmFJ9Eds8YCgcNlpmD0vej3Q","title":"Confirm","response":"1","next_menu":"tC5zhnUnv3SUlda3WWmRfpCp5KRHy6G"},{"id":"reQZ5o6wMCAW35eD4b2smKR6733IZ3g","title":"Cancel","response":"2","next_menu":"1YDAsmV5RHcFgEsONQZigg1tkEmdZIt"}]	jHVQbn9KSlPJRxfqfNB969GkpFZytzS										f			\N	f									\N	\N	\N
99	tC5zhnUnv3SUlda3WWmRfpCp5KRHy6G	1	Thanks data captured and saved	message	[]	WwCg46lxUQVaxsgt1ZSXJhV8wtF0mUa										f			\N	f									\N	\N	\N
100	1YDAsmV5RHcFgEsONQZigg1tkEmdZIt	1	Request cancelled	message	[]	WwCg46lxUQVaxsgt1ZSXJhV8wtF0mUa										f			\N	f									\N	\N	\N
101	GoQsYlb6VqpgXCowhoFQCI7MZQCDHyi	1	IDSR Pneumonia <5 Years Case, < 5, ME	data	[]	eBmIelvfjpi0kFIYMyMy4e91m6A4Yhc	qXCZieHvyrA.AttDwO4xCIu	UHNBrmM4AqZtykdv0vAazwx61uBMXJj	aggregate	IDSR Pneumonia <5 Years Case, < 5, ME						f			\N	f		INTEGER_ZERO_OR_POSITIVE	Pneumonia Case < 5 ME	qXCZieHvyrA	AttDwO4xCIu				\N	\N	\N
102	UHNBrmM4AqZtykdv0vAazwx61uBMXJj	1	IDSR Pneumonia <5 Years Case, < 5, KE	data	[]	GoQsYlb6VqpgXCowhoFQCI7MZQCDHyi	qXCZieHvyrA.QInmZugn9JO	gIopJDNCW6mHje9QkyuzlWPXU5KOs6F	aggregate	IDSR Pneumonia <5 Years Case, < 5, KE						f			\N	f		INTEGER_ZERO_OR_POSITIVE	Pneumonia Case < 5 KE	qXCZieHvyrA	QInmZugn9JO				\N	\N	\N
103	gIopJDNCW6mHje9QkyuzlWPXU5KOs6F	1	IDSR Pneumonia <5 Years Death , < 5, ME	data	[]	UHNBrmM4AqZtykdv0vAazwx61uBMXJj	qXCZieHvyrA.LZsl9VW71qr	fKbj7PAb6awcKYKCvdSuetwlPY5SaF0	aggregate	IDSR Pneumonia <5 Years Death , < 5, ME						f			\N	f		INTEGER_ZERO_OR_POSITIVE	Pneumonia Death < 5 ME	qXCZieHvyrA	LZsl9VW71qr				\N	\N	\N
104	fKbj7PAb6awcKYKCvdSuetwlPY5SaF0	1	IDSR Pneumonia <5 Years Death , < 5, KE	data	[]	gIopJDNCW6mHje9QkyuzlWPXU5KOs6F	qXCZieHvyrA.ifRTBcyGzHU	BjuhSAPxWTbD8gRDzeYhPaNGJdM5HpU	aggregate	IDSR Pneumonia <5 Years Death , < 5, KE						f			\N	f		INTEGER_ZERO_OR_POSITIVE	Pneumonia Death < 5 KE	qXCZieHvyrA	ifRTBcyGzHU				\N	\N	\N
105	BjuhSAPxWTbD8gRDzeYhPaNGJdM5HpU	1	You're about to send data to eIDSR system, Please press	options	[{"id":"bI8jLHNBSEsTjyN5MYlKxP3kTwj3nVC","title":"Confirm","response":"1","next_menu":"jXfG5zkl1WceQqGxl5PqTLASxuXcItm"},{"id":"oNPr1CAnvhXw8gPyMYvhCNyCBnPzhb0","title":"Cancel","response":"2","next_menu":"LD94bTkAtNOh6eH92hqByFYHXmSc3Dl"}]	fKbj7PAb6awcKYKCvdSuetwlPY5SaF0										f			\N	f									\N	\N	\N
106	jXfG5zkl1WceQqGxl5PqTLASxuXcItm	1	Thanks data captured and saved	message	[]	BjuhSAPxWTbD8gRDzeYhPaNGJdM5HpU										f			\N	f									\N	\N	\N
107	LD94bTkAtNOh6eH92hqByFYHXmSc3Dl	1	Request cancelled	message	[]	BjuhSAPxWTbD8gRDzeYhPaNGJdM5HpU										f			\N	f									\N	\N	\N
108	VJ4dqgbMn74sG3ZkbobVWDJUR68G5UG	1	IDSR Tick Borne Relapsing fever Case, < 5, ME	data	[]	eBmIelvfjpi0kFIYMyMy4e91m6A4Yhc	RBLOayRFCwZ.AttDwO4xCIu	Jj485gRwajh1dfaZSbQnx4FqoN4qYX4	aggregate	IDSR Tick Borne Relapsing fever Case, < 5, ME						f			\N	f		INTEGER_ZERO_OR_POSITIVE	TBP Fever Case < 5 ME	RBLOayRFCwZ	AttDwO4xCIu				\N	\N	\N
109	Jj485gRwajh1dfaZSbQnx4FqoN4qYX4	1	IDSR Tick Borne Relapsing fever Case, < 5, KE	data	[]	VJ4dqgbMn74sG3ZkbobVWDJUR68G5UG	RBLOayRFCwZ.QInmZugn9JO	PvnqW5mliANEn5XT3A47d0Hj5QhqKqB	aggregate	IDSR Tick Borne Relapsing fever Case, < 5, KE						f			\N	f		INTEGER_ZERO_OR_POSITIVE	TBP Fever Case < 5 KE	RBLOayRFCwZ	QInmZugn9JO				\N	\N	\N
110	PvnqW5mliANEn5XT3A47d0Hj5QhqKqB	1	IDSR Tick Borne Relapsing fever Death , < 5, ME	data	[]	Jj485gRwajh1dfaZSbQnx4FqoN4qYX4	RBLOayRFCwZ.LZsl9VW71qr	Hmtd7zTFmJRkT3JRHKV8VPGGPoU0zWr	aggregate	IDSR Tick Borne Relapsing fever Death , < 5, ME						f			\N	f		INTEGER_ZERO_OR_POSITIVE	TBP Fever Death < 5 ME	RBLOayRFCwZ	LZsl9VW71qr				\N	\N	\N
111	Hmtd7zTFmJRkT3JRHKV8VPGGPoU0zWr	1	IDSR Tick Borne Relapsing fever Death , < 5, KE	data	[]	PvnqW5mliANEn5XT3A47d0Hj5QhqKqB	RBLOayRFCwZ.ifRTBcyGzHU	QXC3uAaazeyFq7iuU9v5sJ3JScxZLFN	aggregate	IDSR Tick Borne Relapsing fever Death , < 5, KE						f			\N	f		INTEGER_ZERO_OR_POSITIVE	TBP Fever Death < 5 KE	RBLOayRFCwZ	ifRTBcyGzHU				\N	\N	\N
112	QXC3uAaazeyFq7iuU9v5sJ3JScxZLFN	1	IDSR Tick Borne Relapsing fever Case, > 5, ME	data	[]	Hmtd7zTFmJRkT3JRHKV8VPGGPoU0zWr	RBLOayRFCwZ.FRzeEpefSK8	uVmm6VH2Dzma7nGBxVzck1VBvskMTRZ	aggregate	IDSR Tick Borne Relapsing fever Case, > 5, ME						f			\N	f		INTEGER_ZERO_OR_POSITIVE	TBP Fever Case > 5 ME	RBLOayRFCwZ	FRzeEpefSK8				\N	\N	\N
113	uVmm6VH2Dzma7nGBxVzck1VBvskMTRZ	1	IDSR Tick Borne Relapsing fever Case, > 5, KE	data	[]	QXC3uAaazeyFq7iuU9v5sJ3JScxZLFN	RBLOayRFCwZ.q3GdT7f6iw9	Bq3iqhAM3Wqy9t022Y4C0lJRDB1blhA	aggregate	IDSR Tick Borne Relapsing fever Case, > 5, KE						f			\N	f		INTEGER_ZERO_OR_POSITIVE	TBP Fever Case > 5 KE	RBLOayRFCwZ	q3GdT7f6iw9				\N	\N	\N
114	Bq3iqhAM3Wqy9t022Y4C0lJRDB1blhA	1	IDSR Tick Borne Relapsing fever Death , > 5, ME	data	[]	uVmm6VH2Dzma7nGBxVzck1VBvskMTRZ	RBLOayRFCwZ.lW9u3eKdMXH	lyPrKmwtgpQuIcOPpVDrcEOUEImRcRN	aggregate	IDSR Tick Borne Relapsing fever Death , > 5, ME						f			\N	f		INTEGER_ZERO_OR_POSITIVE	TBP Fever Death > 5 ME	RBLOayRFCwZ	lW9u3eKdMXH				\N	\N	\N
115	lyPrKmwtgpQuIcOPpVDrcEOUEImRcRN	1	IDSR Tick Borne Relapsing fever Death , > 5, KE	data	[]	Bq3iqhAM3Wqy9t022Y4C0lJRDB1blhA	RBLOayRFCwZ.Q8U3fXSfxY8	pkQhQCKCB5SPJeYQJ8yI5cZWFNKbuuF	aggregate	IDSR Tick Borne Relapsing fever Death , > 5, KE						f			\N	f		INTEGER_ZERO_OR_POSITIVE	TBP Fever Death > 5 KE	RBLOayRFCwZ	Q8U3fXSfxY8				\N	\N	\N
116	pkQhQCKCB5SPJeYQJ8yI5cZWFNKbuuF	1	You're about to send data to eIDSR system, Please press 	options	[{"id":"7XKB1Nmy9Dyycg7LfKmZI6p0v628Klq","title":"Confirm","response":"1","next_menu":"mco4CALUXI8ucrA7azcIlipMfMaHAy7"},{"id":"LLQXTBaXo4fKpPChdBxSHLkU0M583wa","title":"Cancel","response":"2","next_menu":"fKyctHsC3xvC18A5nAmm0iRoEzc0YtC"}]	lyPrKmwtgpQuIcOPpVDrcEOUEImRcRN										f			\N	f									\N	\N	\N
117	mco4CALUXI8ucrA7azcIlipMfMaHAy7	1	Thanks data captured and saved	message	[]	pkQhQCKCB5SPJeYQJ8yI5cZWFNKbuuF										f			\N	f									\N	\N	\N
118	fKyctHsC3xvC18A5nAmm0iRoEzc0YtC	1	Request cancelled	message	[]	pkQhQCKCB5SPJeYQJ8yI5cZWFNKbuuF										f			\N	f									\N	\N	\N
119	ULc6WxXAQ0lYe5kIF0OaQ5EgvoZCMLG	1	IDSR Trachoma Case, < 5, ME	data	[]	eBmIelvfjpi0kFIYMyMy4e91m6A4Yhc	iBPKR7zootI.AttDwO4xCIu	38pR4oM1NFNKatx5rfvL1yu9EP5yh3N	aggregate	IDSR Trachoma Case, < 5, ME						f			\N	f		INTEGER_ZERO_OR_POSITIVE	Trachoma Case < 5 ME	iBPKR7zootI	AttDwO4xCIu				\N	\N	\N
120	38pR4oM1NFNKatx5rfvL1yu9EP5yh3N	1	IDSR Trachoma Case, < 5, KE	data	[]	ULc6WxXAQ0lYe5kIF0OaQ5EgvoZCMLG	iBPKR7zootI.QInmZugn9JO	DvlvOvyUbwzv3iwuRRPfn5OezFmmZwO	aggregate	IDSR Trachoma Case, < 5, KE						f			\N	f		INTEGER_ZERO_OR_POSITIVE	Trachoma Case < 5 KE	iBPKR7zootI	QInmZugn9JO				\N	\N	\N
121	DvlvOvyUbwzv3iwuRRPfn5OezFmmZwO	1	IDSR Trachoma Death , < 5, ME	data	[]	38pR4oM1NFNKatx5rfvL1yu9EP5yh3N	iBPKR7zootI.LZsl9VW71qr	rTjzgDY6IwhvYYWRDu92rR8OAQXKWMf	aggregate	IDSR Trachoma Death , < 5, ME						f			\N	f		INTEGER_ZERO_OR_POSITIVE	Trachoma Death < 5 ME	iBPKR7zootI	LZsl9VW71qr				\N	\N	\N
122	rTjzgDY6IwhvYYWRDu92rR8OAQXKWMf	1	IDSR Trachoma Death , < 5, KE	data	[]	DvlvOvyUbwzv3iwuRRPfn5OezFmmZwO	iBPKR7zootI.ifRTBcyGzHU	klGtasjsJelPC1VxsOSTVqcDgpCG1e2	aggregate	IDSR Trachoma Death , < 5, KE						f			\N	f		INTEGER_ZERO_OR_POSITIVE	Trachoma Death < 5 KE	iBPKR7zootI	ifRTBcyGzHU				\N	\N	\N
123	klGtasjsJelPC1VxsOSTVqcDgpCG1e2	1	IDSR Trachoma Case, > 5, ME	data	[]	rTjzgDY6IwhvYYWRDu92rR8OAQXKWMf	iBPKR7zootI.FRzeEpefSK8	6eVGsaTGoSDthGH6Ocg7vk8eQevXrxd	aggregate	IDSR Trachoma Case, > 5, ME						f			\N	f		INTEGER_ZERO_OR_POSITIVE	Trachoma Case > 5 ME	iBPKR7zootI	FRzeEpefSK8				\N	\N	\N
124	6eVGsaTGoSDthGH6Ocg7vk8eQevXrxd	1	IDSR Trachoma Case, > 5, KE	data	[]	klGtasjsJelPC1VxsOSTVqcDgpCG1e2	iBPKR7zootI.q3GdT7f6iw9	qX9UgyM1jBR4j1FY4oMxh9RuVajbNvb	aggregate	IDSR Trachoma Case, > 5, KE						f			\N	f		INTEGER_ZERO_OR_POSITIVE	Trachoma Case > 5 KE	iBPKR7zootI	q3GdT7f6iw9				\N	\N	\N
125	qX9UgyM1jBR4j1FY4oMxh9RuVajbNvb	1	IDSR Trachoma Death , > 5, ME	data	[]	6eVGsaTGoSDthGH6Ocg7vk8eQevXrxd	iBPKR7zootI.lW9u3eKdMXH	Hdi75yy5hjSWQNRFwb8h8eye6S8jQes	aggregate	IDSR Trachoma Death , > 5, ME						f			\N	f		INTEGER_ZERO_OR_POSITIVE	Trachoma Death > 5 ME	iBPKR7zootI	lW9u3eKdMXH				\N	\N	\N
126	Hdi75yy5hjSWQNRFwb8h8eye6S8jQes	1	IDSR Trachoma Death , > 5, KE	data	[]	qX9UgyM1jBR4j1FY4oMxh9RuVajbNvb	iBPKR7zootI.Q8U3fXSfxY8	fj5XROWODOR89zjInYWA6gH0aj4yJX1	aggregate	IDSR Trachoma Death , > 5, KE						f			\N	f		INTEGER_ZERO_OR_POSITIVE	Trachoma Death > 5 KE	iBPKR7zootI	Q8U3fXSfxY8				\N	\N	\N
127	fj5XROWODOR89zjInYWA6gH0aj4yJX1	1	You're about to send data to eIDSR system, Please press	options	[{"id":"kvAz3Ya9bPTpM0sJJ6VpgM3cxsqs1xH","title":"Confirm","response":"1","next_menu":"z812ubpovvmXkFqO1r27zw8wdajWeOh"},{"id":"6mm2tX5EP0UBIjgI1hMADiRkVQjeYLF","title":"Cancel","response":"2","next_menu":"DnqdaPMkcBE1vZ5WTdNpU8alojG3009"}]	Hdi75yy5hjSWQNRFwb8h8eye6S8jQes										f			\N	f									\N	\N	\N
128	z812ubpovvmXkFqO1r27zw8wdajWeOh	1	Thanks data captured and saved	message	[]	fj5XROWODOR89zjInYWA6gH0aj4yJX1										f			\N	f									\N	\N	\N
129	DnqdaPMkcBE1vZ5WTdNpU8alojG3009	1	Request cancelled	message	[]	fj5XROWODOR89zjInYWA6gH0aj4yJX1										f			\N	f									\N	\N	\N
130	cvWqFGJB6cKKx1tz51xL6OQmyXVnEax	1	IDSR Trypanosomiasis Case, < 5, ME	data	[]	eBmIelvfjpi0kFIYMyMy4e91m6A4Yhc	r9TEXVjoUun.AttDwO4xCIu	3Ujj4Mihj8sG0ef3cVZmvBea5todnNK	aggregate	IDSR Trypanosomiasis Case, < 5, ME						f			\N	f		INTEGER_ZERO_OR_POSITIVE	Trypanosomiasis Case < 5 ME	r9TEXVjoUun	AttDwO4xCIu				\N	\N	\N
131	3Ujj4Mihj8sG0ef3cVZmvBea5todnNK	1	IDSR Trypanosomiasis Case, < 5, KE	data	[]	cvWqFGJB6cKKx1tz51xL6OQmyXVnEax	r9TEXVjoUun.QInmZugn9JO	pur3OtLMUFRIronbRPz784ogym3UAW3	aggregate	IDSR Trypanosomiasis Case, < 5, KE						f			\N	f		INTEGER_ZERO_OR_POSITIVE	Trypanosomiasis Case < 5 KE	r9TEXVjoUun	QInmZugn9JO				\N	\N	\N
132	pur3OtLMUFRIronbRPz784ogym3UAW3	1	IDSR Trypanosomiasis Death , < 5, ME	data	[]	3Ujj4Mihj8sG0ef3cVZmvBea5todnNK	r9TEXVjoUun.LZsl9VW71qr	gLR1W3sPoONSgdcgT1KUMz53votvNsW	aggregate	IDSR Trypanosomiasis Death , < 5, ME						f			\N	f		INTEGER_ZERO_OR_POSITIVE	Trypanosomiasis Death < 5 ME	r9TEXVjoUun	LZsl9VW71qr				\N	\N	\N
133	gLR1W3sPoONSgdcgT1KUMz53votvNsW	1	IDSR Trypanosomiasis Death , < 5, KE	data	[]	pur3OtLMUFRIronbRPz784ogym3UAW3	r9TEXVjoUun.ifRTBcyGzHU	AUi7TzuKR50bxO71wNrXCrCK3KwrL06	aggregate	IDSR Trypanosomiasis Death , < 5, KE						f			\N	f		INTEGER_ZERO_OR_POSITIVE	Trypanosomiasis Death < 5 KE	r9TEXVjoUun	ifRTBcyGzHU				\N	\N	\N
134	AUi7TzuKR50bxO71wNrXCrCK3KwrL06	1	IDSR Trypanosomiasis Case, > 5, ME	data	[]	gLR1W3sPoONSgdcgT1KUMz53votvNsW	r9TEXVjoUun.FRzeEpefSK8	W2RylMLs67Sxe9gIn5O0kxbes0EMGhO	aggregate	IDSR Trypanosomiasis Case, > 5, ME						f			\N	f		INTEGER_ZERO_OR_POSITIVE	Trypanosomiasis Case > 5 ME	r9TEXVjoUun	FRzeEpefSK8				\N	\N	\N
135	W2RylMLs67Sxe9gIn5O0kxbes0EMGhO	1	IDSR Trypanosomiasis Case, > 5, KE	data	[]	AUi7TzuKR50bxO71wNrXCrCK3KwrL06	r9TEXVjoUun.q3GdT7f6iw9	72vS4Q7vOHPgh6iKaUdstClKDy5kpMR	aggregate	IDSR Trypanosomiasis Case, > 5, KE						f			\N	f		INTEGER_ZERO_OR_POSITIVE	Trypanosomiasis Case > 5 KE	r9TEXVjoUun	q3GdT7f6iw9				\N	\N	\N
136	72vS4Q7vOHPgh6iKaUdstClKDy5kpMR	1	IDSR Trypanosomiasis Death , > 5, ME	data	[]	W2RylMLs67Sxe9gIn5O0kxbes0EMGhO	r9TEXVjoUun.lW9u3eKdMXH	0pYZX9e1wp0usQnqr8c2qn7Cn3Rxmem	aggregate	IDSR Trypanosomiasis Death , > 5, ME						f			\N	f		INTEGER_ZERO_OR_POSITIVE	Trypanosomiasis Death > 5 ME	r9TEXVjoUun	lW9u3eKdMXH				\N	\N	\N
137	0pYZX9e1wp0usQnqr8c2qn7Cn3Rxmem	1	IDSR Trypanosomiasis Death , > 5, KE	data	[]	72vS4Q7vOHPgh6iKaUdstClKDy5kpMR	r9TEXVjoUun.Q8U3fXSfxY8	aGtR7vUCa8lRDJQSZnndgUYoKJKT8Q0	aggregate	IDSR Trypanosomiasis Death , > 5, KE						f			\N	f		INTEGER_ZERO_OR_POSITIVE	Trypanosomiasis Death > 5 KE	r9TEXVjoUun	Q8U3fXSfxY8				\N	\N	\N
138	aGtR7vUCa8lRDJQSZnndgUYoKJKT8Q0	1	You're about to send data to eIDSR system, Please press	options	[{"id":"BPdRlNEm1dIBuvPvjoCbmNXpH3mviZA","title":"Confirm","response":"1","next_menu":"ODgCMQUAWmmZ11rlV9mmFJ6DnRTBnKo"},{"id":"rQ6pMM91ILS8WBcCH5insNv27GqfMN1","title":"Cancel","response":"2","next_menu":"XIaX2qUFSCkgxXYFYNfbAP4fNJhEbXo"}]	0pYZX9e1wp0usQnqr8c2qn7Cn3Rxmem										f			\N	f									\N	\N	\N
139	ODgCMQUAWmmZ11rlV9mmFJ6DnRTBnKo	1	Thanks data captured and saved	message	[]	aGtR7vUCa8lRDJQSZnndgUYoKJKT8Q0										f			\N	f									\N	\N	\N
140	XIaX2qUFSCkgxXYFYNfbAP4fNJhEbXo	1	Request cancelled	message	[]	aGtR7vUCa8lRDJQSZnndgUYoKJKT8Q0										f			\N	f									\N	\N	\N
141	mjXZaHKtKHp76yHLsP5RWc9uD6ijjNY	1	IDSR Typhiod Case, < 5, ME	data	[]	eBmIelvfjpi0kFIYMyMy4e91m6A4Yhc	OOnL47t1Ltg.AttDwO4xCIu	lzrSGKeZ8eBQTUgnd42BOlftgXAD26P	aggregate	IDSR Typhiod Case, < 5, ME						f			\N	f		INTEGER_ZERO_OR_POSITIVE	Typhiod Case < 5 ME	OOnL47t1Ltg	AttDwO4xCIu				\N	\N	\N
142	lzrSGKeZ8eBQTUgnd42BOlftgXAD26P	1	IDSR Typhiod Case, < 5, KE	data	[]	mjXZaHKtKHp76yHLsP5RWc9uD6ijjNY	OOnL47t1Ltg.QInmZugn9JO	t2lKRjUrUSGqAyF9rbPJn0cULQNeAf8	aggregate	IDSR Typhiod Case, < 5, KE						f			\N	f		INTEGER_ZERO_OR_POSITIVE	Typhiod Case < 5 KE	OOnL47t1Ltg	QInmZugn9JO				\N	\N	\N
143	t2lKRjUrUSGqAyF9rbPJn0cULQNeAf8	1	IDSR Typhiod Death , < 5, ME	data	[]	lzrSGKeZ8eBQTUgnd42BOlftgXAD26P	OOnL47t1Ltg.LZsl9VW71qr	d3DzkIsZvg8gf7vyK7qzl3QZ7d9Kotg	aggregate	IDSR Typhiod Death , < 5, ME						f			\N	f		INTEGER_ZERO_OR_POSITIVE	Typhiod Death < 5 ME	OOnL47t1Ltg	LZsl9VW71qr				\N	\N	\N
144	d3DzkIsZvg8gf7vyK7qzl3QZ7d9Kotg	1	IDSR Typhiod Death , < 5, KE	data	[]	t2lKRjUrUSGqAyF9rbPJn0cULQNeAf8	OOnL47t1Ltg.ifRTBcyGzHU	rqTMw379wczO62GGXrHKij4548Q16VX	aggregate	IDSR Typhiod Death , < 5, KE						f			\N	f		INTEGER_ZERO_OR_POSITIVE	Typhiod Death < 5 KE	OOnL47t1Ltg	ifRTBcyGzHU				\N	\N	\N
145	rqTMw379wczO62GGXrHKij4548Q16VX	1	IDSR Typhiod Case, > 5, ME	data	[]	d3DzkIsZvg8gf7vyK7qzl3QZ7d9Kotg	OOnL47t1Ltg.FRzeEpefSK8	tA5yvmpdJI4pnkRuWXj0UZBPIjPMYlO	aggregate	IDSR Typhiod Case, > 5, ME						f			\N	f		INTEGER_ZERO_OR_POSITIVE	Typhiod Case > 5 ME	OOnL47t1Ltg	FRzeEpefSK8				\N	\N	\N
146	tA5yvmpdJI4pnkRuWXj0UZBPIjPMYlO	1	IDSR Typhiod Case, > 5, KE	data	[]	rqTMw379wczO62GGXrHKij4548Q16VX	OOnL47t1Ltg.q3GdT7f6iw9	XPHv3BO5yXIm5MFyvTA9fzbEVmaeVqT	aggregate	IDSR Typhiod Case, > 5, KE						f			\N	f		INTEGER_ZERO_OR_POSITIVE	Typhiod Case > 5 KE	OOnL47t1Ltg	q3GdT7f6iw9				\N	\N	\N
147	XPHv3BO5yXIm5MFyvTA9fzbEVmaeVqT	1	IDSR Typhiod Death , > 5, ME	data	[]	tA5yvmpdJI4pnkRuWXj0UZBPIjPMYlO	OOnL47t1Ltg.lW9u3eKdMXH	Ym4gznzJpPHQPGphk80iX0nJrOb1586	aggregate	IDSR Typhiod Death , > 5, ME						f			\N	f		INTEGER_ZERO_OR_POSITIVE	Typhiod Death > 5 ME	OOnL47t1Ltg	lW9u3eKdMXH				\N	\N	\N
148	Ym4gznzJpPHQPGphk80iX0nJrOb1586	1	IDSR Typhiod Death , > 5, KE	data	[]	XPHv3BO5yXIm5MFyvTA9fzbEVmaeVqT	OOnL47t1Ltg.Q8U3fXSfxY8	zKCiTyK8fPAlL2xoBTUcocOjHo5a9ng	aggregate	IDSR Typhiod Death , > 5, KE						f			\N	f		INTEGER_ZERO_OR_POSITIVE	Typhiod Death > 5 KE	OOnL47t1Ltg	Q8U3fXSfxY8				\N	\N	\N
149	zKCiTyK8fPAlL2xoBTUcocOjHo5a9ng	1	You're about to send data to eIDSR system, Please press	options	[{"id":"UEXJPF4V5uzWifTnD2UsC0FLnZOHeTf","title":"Confirm","response":"1","next_menu":"BfowImSxqdCU4V9WlvGAKPGMDxPPhWH"},{"id":"cnM4pgHWBBehmtAzmhnNECUlxKwoR7X","title":"Cancel","response":"2","next_menu":"HjOxllfWCty3aDQcJwDZEOGPLi7pqFm"}]	Ym4gznzJpPHQPGphk80iX0nJrOb1586										f			\N	f									\N	\N	\N
150	BfowImSxqdCU4V9WlvGAKPGMDxPPhWH	1	Thanks data captured and saved 	message	[]	zKCiTyK8fPAlL2xoBTUcocOjHo5a9ng										f			\N	f									\N	\N	\N
151	HjOxllfWCty3aDQcJwDZEOGPLi7pqFm	1	Request cancelled	message	[]	zKCiTyK8fPAlL2xoBTUcocOjHo5a9ng										f			\N	f									\N	\N	\N
152	dyldF5LOzTTmCjzTSVrVU8UPVYZQgBN	1	IDSR Malaria Tested (Lab/MRDT) Cases Case, < 5	data	[]	vS1HlGTUeDwps5JivGLRxGQEXdLBv5G	Jl5fGRORobn.rphvCz1EY6I	a1AG9rJ0C0fB314N10G0KHDOCdfF5g7	aggregate	IDSR Malaria Tested (Lab/MRDT) Cases Case, < 5						f			\N	f		INTEGER_ZERO_OR_POSITIVE	Malaria Tested Case < 5	Jl5fGRORobn	rphvCz1EY6I				\N	\N	\N
153	a1AG9rJ0C0fB314N10G0KHDOCdfF5g7	1	IDSR Malaria Tested (Lab/MRDT) Cases Case, > 5	data	[]	dyldF5LOzTTmCjzTSVrVU8UPVYZQgBN	Jl5fGRORobn.vPuWSFjehIm	XEXxi6enTph3ricCv59s28RoHEuyUmL	aggregate	IDSR Malaria Tested (Lab/MRDT) Cases Case, > 5						f			\N	f		INTEGER_ZERO_OR_POSITIVE	Malaria Tested Case > 5	Jl5fGRORobn	vPuWSFjehIm				\N	\N	\N
154	XEXxi6enTph3ricCv59s28RoHEuyUmL	1	IDSR Malaria Tested Positive Case, < 5	data	[]	a1AG9rJ0C0fB314N10G0KHDOCdfF5g7	aTBq63q6SGs.rphvCz1EY6I	rqj6ziOzaZ6MNPjmp5OFB32ugG9GoPM	aggregate	IDSR Malaria Tested Positive Case, < 5						f			\N	f		INTEGER_ZERO_OR_POSITIVE	Malaria Tested +ve Case < 5	aTBq63q6SGs	rphvCz1EY6I				\N	\N	\N
155	rqj6ziOzaZ6MNPjmp5OFB32ugG9GoPM	1	IDSR Malaria Tested Positive Case, > 5	data	[]	XEXxi6enTph3ricCv59s28RoHEuyUmL	aTBq63q6SGs.vPuWSFjehIm	CJ2aXQivSyrfYlGsKjC9CtfFEDYa6nW	aggregate	IDSR Malaria Tested Positive Case, > 5						f			\N	f		INTEGER_ZERO_OR_POSITIVE	Malaria Tested +ve Case > 5	aTBq63q6SGs	vPuWSFjehIm				\N	\N	\N
156	CJ2aXQivSyrfYlGsKjC9CtfFEDYa6nW	1	IDSR Malaria Clinical Cases Case, < 5	data	[]	rqj6ziOzaZ6MNPjmp5OFB32ugG9GoPM	hGXnKNp7HW6.rphvCz1EY6I	RZYCTbLOpXc5y9G99S2Wdly6ISzd1ma	aggregate	IDSR Malaria Clinical Cases Case, < 5						f			\N	f		INTEGER_ZERO_OR_POSITIVE	Malaria Clinical Case < 5	hGXnKNp7HW6	rphvCz1EY6I				\N	\N	\N
157	RZYCTbLOpXc5y9G99S2Wdly6ISzd1ma	1	IDSR Malaria Clinical Cases Case, > 5	data	[]	CJ2aXQivSyrfYlGsKjC9CtfFEDYa6nW	hGXnKNp7HW6.vPuWSFjehIm	nqToOwNzB33kCE9aoC1v91UcKDZIjQ4	aggregate	IDSR Malaria Clinical Cases Case, > 5						f			\N	f		INTEGER_ZERO_OR_POSITIVE	Malaria Clinical Case > 5	hGXnKNp7HW6	vPuWSFjehIm				\N	\N	\N
158	nqToOwNzB33kCE9aoC1v91UcKDZIjQ4	1	You're about to send data to eIDSR system, Please press	options	[{"id":"IM5ndfk3BnaEJQK6FUMEVArgXyCLOGh","title":"Confirm","response":"1","next_menu":"wQojhtNEczGF0BIMEsMIhMbwg6hJF2b"},{"id":"UxLwgLy1igI9HAi3cmKlFQK3b3IJ9SK","title":"Cancel","response":"2","next_menu":"GO4DiNhE4y3i7vyTN3uI8B0uAXZ1MRg"}]	RZYCTbLOpXc5y9G99S2Wdly6ISzd1ma										f			\N	f									\N	\N	\N
160	GO4DiNhE4y3i7vyTN3uI8B0uAXZ1MRg	1	Request cancelled	message	[]	nqToOwNzB33kCE9aoC1v91UcKDZIjQ4										f			\N	f									\N	\N	\N
161	kCG4GuryXNuhzlyd5vUYSRM4hbxG8ip	1	Enter week number	period	[]	peKiGAl2jiM3yglJ8CduJlUHRkbIr4C		PkXuCfwo2qbNTpHTAhw8fGWNSW5Umw9					Try again	3		f		Weekly	52	f									\N	\N	\N
162	PkXuCfwo2qbNTpHTAhw8fGWNSW5Umw9	1	Report for Year	period	[]	kCG4GuryXNuhzlyd5vUYSRM4hbxG8ip		uPaoYOZOoRGvmkb29GvzuzNhjcRWqvA					Try again	3		f			\N	t	2								\N	\N	\N
163	uPaoYOZOoRGvmkb29GvzuzNhjcRWqvA	1	Are all weekly diseases entered? Press 1 to send data or 2 to cancel 	options	[{"id":"fHwWEXvN8h3vyYqAnQVNdJT1AIVGCF8","title":"Submit","response":"1","next_menu":"xQ7VPMXWLpc5aFSuupwOw5qAxxxhgYq"},{"id":"WBtql94UQmspsgpZeH9Fq8Eh03hflt9","title":"Cancel","response":"2","next_menu":"wjvOExz6MpWoiogrzzhnnxVNzlVv2U2"}]	PkXuCfwo2qbNTpHTAhw8fGWNSW5Umw9										f			\N	f									\N	\N	\N
164	xQ7VPMXWLpc5aFSuupwOw5qAxxxhgYq	1	Thanks data captured and saved	message	[]	uPaoYOZOoRGvmkb29GvzuzNhjcRWqvA										f			\N	f									\N	\N	\N
165	wjvOExz6MpWoiogrzzhnnxVNzlVv2U2	1	Request cancelled	message	[]	uPaoYOZOoRGvmkb29GvzuzNhjcRWqvA										f			\N	f									\N	\N	\N
166	tDcOOo5V8ItOIuEiZRTJS5EKht0xQWz	1	Select disease	data	[{"id":"O1EI6g6MKIi","title":"Acute Flaccid Paralysis","response":"1","value":"Acute Flaccid Paralysis"},{"id":"B70JzjQ4KXX","title":"Anthrax","response":"2","value":"Anthrax"},{"id":"F8Pm816IpMH","title":"Blood diarrhoea","response":"3","value":"Blood diarrhoea"}]	NVd4wtTY1i4sYAtMJzedU1EXfblkd2n	DWD892cNO8q	dGlatCe4UGeJ3Ok1GrkE5fPtq0Ghnes	tracker	IDSR Disease						f			\N	f		TEXT	IDSR Disease				bWW1WxiP9lY		\N	XjMhM0eneKI	DWD892cNO8q
167	4LxL9vVyIvIN1KsLGdC4SMyS7pY5ok6	1	Select Disease	options	[{"id":"2FDo6AVVIzIG9N2H8fCxKHsMT3lvhoU","title":"Human influenza","response":"1","next_menu":"Qx2FgUQwGT4yKwzPO7iux8Vv89NCJSt"},{"id":"imn32YQCdZMxHDOkEVEEkMSGYLvB8wy","title":"Maternal Death","response":"2","next_menu":"0t32HAstzIeHzz7FxrI7Z0jtIPOPqIc"},{"id":"iWw6gVluJ2QvXGQcNHfEEMWqDqkIAA3","title":"Measles","response":"3","next_menu":"JxuW335ALOdwYpYcLXmn2twustoPohD"},{"id":"9WvPvxIguhP1zE0231bV9awwTxwZ7c6","title":"Neonatal Tetanus","response":"4","next_menu":"PrtaeEU2JAEGeLXMpVv6HX0QCXoZNjF"},{"id":"zyfNoZhTxUkFVdqlf2BdVLcICQ1TBL5","title":"Plague","response":"5","next_menu":"0vKKEbNuCskR6ejzkLnhZpejTLoy27p"}]	NVd4wtTY1i4sYAtMJzedU1EXfblkd2n										f			\N	f									\N	\N	\N
168	Qx2FgUQwGT4yKwzPO7iux8Vv89NCJSt	1	Enter number of days since symptoms began	period	[]	4LxL9vVyIvIN1KsLGdC4SMyS7pY5ok6		CYPwhctOxViIfUgMHw8cosYPTcXJETs				Terminated	Try again	3		f		Weekly	52	f									\N	\N	\N
169	0t32HAstzIeHzz7FxrI7Z0jtIPOPqIc	1	Enter number of days since symptoms began	period	[]	4LxL9vVyIvIN1KsLGdC4SMyS7pY5ok6		PFiqwkprTb9lCOEXtPf0ECv7ELhbBtG				Terminated	Try again	3		f		Weekly	52	f									\N	\N	\N
170	JxuW335ALOdwYpYcLXmn2twustoPohD	1	Enter number of days since symptoms began	period	[]	4LxL9vVyIvIN1KsLGdC4SMyS7pY5ok6		eXvKry1HRX3ir6nNiXOK2qm2edL6dV4				Terminated	Try again	3		f		Weekly	52	f									\N	\N	\N
171	PrtaeEU2JAEGeLXMpVv6HX0QCXoZNjF	1	Enter number of days since symptoms began	period	[]	4LxL9vVyIvIN1KsLGdC4SMyS7pY5ok6		7aFGMmZfFVmETgLcz85U4vrXFo5Xrj4				Termiated	Try again	3		f		Weekly	52	f									\N	\N	\N
172	0vKKEbNuCskR6ejzkLnhZpejTLoy27p	1	Enter number of days since symptoms began	period	[]	4LxL9vVyIvIN1KsLGdC4SMyS7pY5ok6		avMusXXh5bjIDlLwC4NlGIpBRCuQV7E				Terminated	Try again	3		f		Weekly	52	f									\N	\N	\N
173	mIlxWvCLPVkLWQhkt0vW3U7Aj5QoJZq	1	Enter number of days since symptoms began	period	[]	Fk0c4nEebfGYNyDPP8zlk4Xb3aGfveU		m71IbhbfwAwonaA8h8j7WlAl2VL8DvU				Terminated	Try again	3		f		Weekly	52	f									\N	\N	\N
174	c4CiqVpmC4LUYJxKW4DVLLdJFjJE1y5	1	Enter number of days since symptoms began	period	[]	Fk0c4nEebfGYNyDPP8zlk4Xb3aGfveU		oC2G5CoetfubTvW71Z2CS5PdCB1EjQD				Terminated	Try again	3		f		Weekly	52	f									\N	\N	\N
175	243zzMRVOjgiWmEUYjqyei3CtLyGzzm	1	Enter number of days since symptoms began	period	[]	Fk0c4nEebfGYNyDPP8zlk4Xb3aGfveU		m6gQT3GVxF2t5eQ6QhkV8E6kue2VIey				Terminated	Try again	3		f		Weekly	52	f									\N	\N	\N
176	0Dwx6FFgO0pDndX7Jdr9xiU1zDn62M3	1	Enter number of days since symptoms began	period	[]	Fk0c4nEebfGYNyDPP8zlk4Xb3aGfveU		oavVjGE34yELubXmNuGELyRKxbKT0Sm				Terminated	Try again	3		f		Weekly	52	f									\N	\N	\N
177	CYPwhctOxViIfUgMHw8cosYPTcXJETs	1	Patient Age type	options	[{"id":"nxBqHWVJeCiHbnbsmtFAIAcoQnsLAtV","title":"Years","response":"1","next_menu":""},{"id":"ISk667Vrtap0KBMgB4JsSY1y2Zy8m9q","title":"Months","response":"2","next_menu":""},{"id":"lguyeKtfNtbglM9Zeou4q5Th00qo04h","title":"Days","response":"3","next_menu":""}]	Qx2FgUQwGT4yKwzPO7iux8Vv89NCJSt										f			\N	f									\N	\N	\N
178	PFiqwkprTb9lCOEXtPf0ECv7ELhbBtG	1	Patient Age type	options	[{"id":"wflJvJ4FDFlRQi4DYQxCoq1nK0IOUNg","title":"Years","response":"1","next_menu":""},{"id":"IlumkejfV5v5HbsdcILbzH9YorlXZUk","title":"Months","response":"2","next_menu":""},{"id":"4qfGNTrkToXQV3JKeOJWaQAUkbq1m00","title":"Days","response":"3","next_menu":""}]	0t32HAstzIeHzz7FxrI7Z0jtIPOPqIc										f			\N	f									\N	\N	\N
179	eXvKry1HRX3ir6nNiXOK2qm2edL6dV4	1	Patient Age type	options	[{"id":"v133nOdQ7EDIXva34KQIYDzS8aviNWV","title":"Years","response":"1","next_menu":""},{"id":"uBCpVpCF0UxSaNQzeI4qYhMaH6bmQOs","title":"Months","response":"2","next_menu":""},{"id":"x91Y4gW8xHnwt7eu0IVJGKqXFWskspn","title":"Days","response":"3","next_menu":""}]	JxuW335ALOdwYpYcLXmn2twustoPohD										f			\N	f									\N	\N	\N
180	7aFGMmZfFVmETgLcz85U4vrXFo5Xrj4	1	Patient Age type	options	[{"id":"QF2I0sBu2QwP4bT4UMO4SeSA9WP1jZO","title":"Years","response":"1","next_menu":""},{"id":"MIihB2ZNv46s7C20bMgUp0c9fUMOhSM","title":"Months","response":"2","next_menu":""},{"id":"ttNkFypJFaOabO0YWn3ibIQnB6Ophex","title":"Days","response":"3","next_menu":""}]	PrtaeEU2JAEGeLXMpVv6HX0QCXoZNjF										f			\N	f									\N	\N	\N
181	avMusXXh5bjIDlLwC4NlGIpBRCuQV7E	1	Patient Age type	options	[{"id":"2fSAvIS5yzJORGwtLbOH48H8Gr1lfLx","title":"Years","response":"1","next_menu":""},{"id":"3Q6tB9DXRFpXcjDl09zxQl0whh28ntC","title":"Months","response":"2","next_menu":""},{"id":"WgsyyatHTctFoe9Gu3BNgXWYI0igcwU","title":"Days","response":"3","next_menu":""}]	0vKKEbNuCskR6ejzkLnhZpejTLoy27p										f			\N	f									\N	\N	\N
182	m71IbhbfwAwonaA8h8j7WlAl2VL8DvU	1	Patient Age type	options	[{"id":"4dRFcYTLjIaxDi0UofijCrOLkc6C1s9","title":"Years","response":"1","next_menu":""},{"id":"m8O2MOOpG5p9fRNwegqg4bOx8C08pYU","title":"Months","response":"2","next_menu":""},{"id":"Gu6i09PxjT43fjj548ceNFkYPQB6HMZ","title":"Days","response":"3","next_menu":""}]	mIlxWvCLPVkLWQhkt0vW3U7Aj5QoJZq										f			\N	f									\N	\N	\N
183	oC2G5CoetfubTvW71Z2CS5PdCB1EjQD	1	Patient Age type	options	[{"id":"osspi1JiaQLdPdei0C7rKBr68Q2psBf","title":"Years","response":"1","next_menu":""},{"id":"qJFTuta7dhIsL0EZOg6c6yCMUuvn3bJ","title":"Months","response":"2","next_menu":""},{"id":"glcIhQKpMjNgtri5ZjzPzmr3Mx1Ebjr","title":"Days","response":"3","next_menu":""}]	c4CiqVpmC4LUYJxKW4DVLLdJFjJE1y5										f			\N	f									\N	\N	\N
257	IHJylUZeSD4PXmEGRA2GbZmlCepE7cX	1	 Disease Name: Malaria Clinical Cases above 5	data	[]	bnL2F5HOC4siFMadmIb8b7hRNdbyrCg	hGXnKNp7HW6.vPuWSFjehIm	d1CSJya9Y6525UYo5ifGMEHrbKg4c8n	aggregate	IDSR Malaria Clinical Cases Case, > 5						f			\N	f		INTEGER_ZERO_OR_POSITIVE	Malaria Clinical Case > 5	hGXnKNp7HW6	vPuWSFjehIm				\N	\N	\N
184	m6gQT3GVxF2t5eQ6QhkV8E6kue2VIey	1	Patient Age type	options	[{"id":"IT38EAvcdTritKBSXjaYcjG3X1VqBUF","title":"Years","response":"1","next_menu":""},{"id":"FbLdgek6l6g5X2arjR8JyNHCmNbtitF","title":"Months","response":"2","next_menu":""},{"id":"mjgjM2uHDN3o58aDexATg6BNpRDxHSE","title":"Days","response":"3","next_menu":""}]	243zzMRVOjgiWmEUYjqyei3CtLyGzzm										f			\N	f									\N	\N	\N
185	oavVjGE34yELubXmNuGELyRKxbKT0Sm	1	Patient Age type	options	[{"id":"LzwAzPjt9ImbkOjfEK4V4JHnAB4srEF","title":"Years","response":"1","next_menu":""},{"id":"jX2yKMEbviLJxRvbYsZWT1G9xyodNBm","title":"Months","response":"2","next_menu":""},{"id":"V3iX94CIC0haVwnrQkEWuIPpU8bBmoW","title":"Days","response":"3","next_menu":""}]	0Dwx6FFgO0pDndX7Jdr9xiU1zDn62M3										f			\N	f									\N	\N	\N
186	Bqy8fpOw2ix4bhsGkKyUaanE2cRZuh3	1	IDSR Disease	data	[{"id":"RhglzwW0Stv","title":"A00.9-Cholera ","response":"1","value":"A00.9-Cholera "},{"id":"O1EI6g6MKIi","title":"Acute Flaccid Paralysis","response":"2","value":"Acute Flaccid Paralysis"},{"id":"B70JzjQ4KXX","title":"Anthrax","response":"3","value":"Anthrax"},{"id":"F8Pm816IpMH","title":"Blood diarrhoea","response":"4","value":"Blood diarrhoea"},{"id":"TWBvtjAyB60","title":"Cerebral Spinal Meningitis","response":"5","value":"Cerebral Spinal Meningitis"},{"id":"e4oD5L3E0B8","title":"Epidemic viral keratoconjuctivitis","response":"6","value":"Epidemic viral keratoconjuctivitis"}]	NVd4wtTY1i4sYAtMJzedU1EXfblkd2n	Of2oRqwosOB	BUbgOLdMSKahZNQvLxAsJxFpaIqQZYQ	event	IDSR Disease						f			\N	f		TEXT	Disease	Of2oRqwosOB			Rt3ZfijCNSR	oIfXzXib4AE	\N	\N	\N
187	BUbgOLdMSKahZNQvLxAsJxFpaIqQZYQ	1	IDSR Number of days since symptoms	data	[]	Bqy8fpOw2ix4bhsGkKyUaanE2cRZuh3	VhU1TQa5hJV	7BsyqVvFzQ0Hp8jj9QjnynA3oxskRCo	event	IDSR Number of days since symptoms						f			\N	f		INTEGER_POSITIVE	Days since symptoms	VhU1TQa5hJV			Rt3ZfijCNSR	oIfXzXib4AE	\N	\N	\N
188	7BsyqVvFzQ0Hp8jj9QjnynA3oxskRCo	1	Age Type	data	[{"id":"gROcyTVfL8h","title":"Days","response":"1","value":"Days"},{"id":"vW2sozl2oPn","title":"Months","response":"2","value":"Months"},{"id":"zpdLUDfUUxt","title":"Years","response":"3","value":"Years"}]	BUbgOLdMSKahZNQvLxAsJxFpaIqQZYQ	JJkV68Devly		event	Age Type						f			\N	f		TEXT	Age Type	JJkV68Devly			Rt3ZfijCNSR	oIfXzXib4AE	\N	\N	\N
189	sWbxB4fanqRgj6LU4fPdRSGUG3ZBdGE	1	Select disease	data	[{"id":"lYumR9CwHhC","title":"Rabies","response":"1","value":"Rabies"},{"id":"W1yHYvH5lye","title":"Small Pox","response":"2","value":"Small Pox"},{"id":"siHXE4a9eVk","title":"Unknown condition","response":"3","value":"Unknown condition"},{"id":"rg1yrnDRWU6","title":"Viral Haemorrhagic Fever","response":"4","value":"Viral Haemorrhagic Fever"},{"id":"vDIcpuMIqAU","title":"Yellow fever","response":"5","value":"Yellow fever"}]	NVd4wtTY1i4sYAtMJzedU1EXfblkd2n	Of2oRqwosOB	mRHwSMkOGBWBpTDXY1qzu6fz7t1NWbA	event	IDSR Disease						f			\N	f		TEXT	IDSR Disease	Of2oRqwosOB			Rt3ZfijCNSR	oIfXzXib4AE	\N	\N	\N
190	dGlatCe4UGeJ3Ok1GrkE5fPtq0Ghnes	1	Enter number of days since symptoms began	data	[]	tDcOOo5V8ItOIuEiZRTJS5EKht0xQWz	auNpv9QUve4	9drAotHyiS37G6eWxwbuMb4jh6xu9T1	tracker	IDSR Number of days since symptoms						f			\N	f		INTEGER_POSITIVE	IDSR Days since symptoms				bWW1WxiP9lY		\N	XjMhM0eneKI	auNpv9QUve4
191	9drAotHyiS37G6eWxwbuMb4jh6xu9T1	1	Choose Patient age Type	data	[{"id":"gROcyTVfL8h","title":"Days","response":"1","value":"Days"},{"id":"vW2sozl2oPn","title":"Months","response":"2","value":"Months"},{"id":"zpdLUDfUUxt","title":"Years","response":"3","value":"Years"}]	dGlatCe4UGeJ3Ok1GrkE5fPtq0Ghnes	HqazINzzsEZ	9BfHO6l7syDTq1Y8XCtTcWglgZhKNjK	tracker	IDSR Age Type						f			\N	f		TEXT	Age Type				bWW1WxiP9lY		\N	XjMhM0eneKI	HqazINzzsEZ
192	9BfHO6l7syDTq1Y8XCtTcWglgZhKNjK	1	Enter Patient Age	data	[]	9drAotHyiS37G6eWxwbuMb4jh6xu9T1	PVF0hs3YxRz	iKpNK0ty7nfp2iOuYBf5cCxFReS1SE8	tracker	IDSR Patient Age						f			\N	f		INTEGER_POSITIVE	IDSR Patient Age				bWW1WxiP9lY		\N	XjMhM0eneKI	PVF0hs3YxRz
193	iKpNK0ty7nfp2iOuYBf5cCxFReS1SE8	1	Choose Patient Gender	data	[{"id":"k9uPFST6kxm","title":"Female","response":"1","value":"Female"},{"id":"sHZeC3hmKwG","title":"Male","response":"2","value":"Male"}]	9BfHO6l7syDTq1Y8XCtTcWglgZhKNjK	odR6HcTNgEW	0EvJXbri92jZ5Dmp3zvwErV8XISBgHt	tracker	IDSR Jinsia						f			\N	f		TEXT	IDSR Jinsia				bWW1WxiP9lY		\N	XjMhM0eneKI	odR6HcTNgEW
194	0EvJXbri92jZ5Dmp3zvwErV8XISBgHt	1	Select Case definition	data	[{"id":"kK02ky0Z0pP","title":"Confirmed","response":"1","value":"Confirmed"},{"id":"AiiRMEPTuhr","title":"Probable","response":"2","value":"Probable"},{"id":"CVpB5Yveq0s","title":"Suspected","response":"3","value":"Suspected"}]	iKpNK0ty7nfp2iOuYBf5cCxFReS1SE8	b4xVFUUgMP2	TLihNIWWAz0bQ5QQ5Uet2n6zfBeWqkE	tracker	IDSR Case Definition						f			\N	f		TEXT	IDSR Case Definition				bWW1WxiP9lY		\N	XjMhM0eneKI	b4xVFUUgMP2
195	TLihNIWWAz0bQ5QQ5Uet2n6zfBeWqkE	1	Was patient Vaccinated?	data	[{"id":"P9QrlSg3iDa","title":"No","response":"1","value":"No"},{"id":"qzHmwhHj9Sc","title":"Not Applicable","response":"2","value":"false"},{"id":"stS1n3ZPr2I","title":"Yes","response":"3","value":"Yes"}]	0EvJXbri92jZ5Dmp3zvwErV8XISBgHt	fbIXx7uohES	ZJoA6OO1PwGGf61Zk2enUOTSZ2LAQyT	tracker	IDSR Was patient Vaccinated						f			\N	f		TEXT	IDSR patient vaccinated				bWW1WxiP9lY		\N	XjMhM0eneKI	fbIXx7uohES
196	ZJoA6OO1PwGGf61Zk2enUOTSZ2LAQyT	1	Was Lab specimen taken?	data	[{"id":"oF3gcP52nI4neQgDZYVUx7oc8Pd22UE","title":"Yes","response":"1","value":true},{"id":"54xhVY0tYFo4w7xurc6xZvaGBGPdGEP","title":"No","response":"2","value":false,"next_menu":"C1jlzameM6Ki0EPgDxmlgYiFZwbiC38"}]	TLihNIWWAz0bQ5QQ5Uet2n6zfBeWqkE	ae0ReCg7C0G	WNyIdHEvNdvdQP4rGB5otEh7bSjRqFM	tracker	IDSR Was Lab specimen taken						f			\N	f		BOOLEAN	IDSR LabSpecimenTaken				bWW1WxiP9lY		\N	XjMhM0eneKI	ae0ReCg7C0G
197	WNyIdHEvNdvdQP4rGB5otEh7bSjRqFM	1	Where was specimen sent?	data	[{"id":"yGBNyTE3xsL","title":"Discarded","response":"1","value":"Discarded"},{"id":"Md8STGhrz8p","title":"District Lab","response":"2","value":"District Lab"},{"id":"NaADyB0u3XK","title":"National Lab","response":"3","value":"National Lab"},{"id":"YOPmcMcSc2D","title":"Regional Lab","response":"4","value":"Regional Lab"}]	ZJoA6OO1PwGGf61Zk2enUOTSZ2LAQyT	bTqb2dov2Pl	ytCeqIukP85MRwPx9wxTyaZgG8KhTs8	tracker	IDSR Where was specimen sent						f			\N	f		TEXT	IDSR WhereSpecimenSent				bWW1WxiP9lY		\N	XjMhM0eneKI	bTqb2dov2Pl
198	ytCeqIukP85MRwPx9wxTyaZgG8KhTs8	1	Is the patient alive?	data	[{"id":"DtOtGVbxuYiBhAxtx0Xi51OsTn4tqbO","title":"Yes","response":"1","value":true},{"id":"Z2byd9ry8PCYrWIpEhsY8EsDNF1V7Ag","title":"No","response":"2","value":false,"next_menu":"UlKRfLrMgUsvpw5HzkIHytoCTYY5Zds"}]	WNyIdHEvNdvdQP4rGB5otEh7bSjRqFM	oqpyDVwngtS	CHfZY7Kr88FcRZCuT7IOrkEgyJQFXW2	tracker	IDSR Is the patient alive						f			\N	f		BOOLEAN	IDSR is patient alive				bWW1WxiP9lY		\N	XjMhM0eneKI	oqpyDVwngtS
199	CHfZY7Kr88FcRZCuT7IOrkEgyJQFXW2	1	Patient status 	data	[{"id":"anvzMd7xobk","title":"Admitted","response":"1","value":"Admitted"},{"id":"stoRl0yUgwO","title":"Discharged","response":"2","value":"Discharged"},{"id":"cQwAovxLRbn","title":"OPD","response":"3","value":"OPD"}]	ytCeqIukP85MRwPx9wxTyaZgG8KhTs8	UiKNNd6Bs6R	TFAjGuJgpUShyR94mCkVehUrslwm87I	tracker	IDSR Patient status						f			\N	f		TEXT	IDSR Patient status				bWW1WxiP9lY		\N	XjMhM0eneKI	UiKNNd6Bs6R
258	d1CSJya9Y6525UYo5ifGMEHrbKg4c8n	1	Disease Name: Malaria Report for Year	period	[]	IHJylUZeSD4PXmEGRA2GbZmlCepE7cX		3ld7Kjx2Ns2h5U9uXa2im3qvz4n4guN				undefined - Sasa hivi.	Please Try again latrer	3		f			\N	t	2								\N	\N	\N
200	TFAjGuJgpUShyR94mCkVehUrslwm87I	1	Action Taken: Referred?	data	[{"id":"5nDZDLvzTnU3IiMDD2F0yIi4uZQu8IG","title":"Yes","response":"1","value":true},{"id":"NFVgTx0CnbVlkDTicrLG9ZX4rRBXzgP","title":"No","response":"2","value":false}]	CHfZY7Kr88FcRZCuT7IOrkEgyJQFXW2	jKXm6hkYeFo	uM1pACv0LeUmqxbnYaNFMvOBPxB2sDE	tracker	IDSR Action Taken: Referred?						f			\N	f		BOOLEAN	IDSR AT: Referred				bWW1WxiP9lY		\N	XjMhM0eneKI	jKXm6hkYeFo
201	uM1pACv0LeUmqxbnYaNFMvOBPxB2sDE	1	Action Taken: Admitted?	data	[{"id":"9AlPH95nfaqpAU0vYVl6AtPqRaGDMX7","title":"Yes","response":"1","value":true},{"id":"sPkxrKLXCTd6biB2ulcOa1500bfYbnO","title":"No","response":"2","value":false}]	TFAjGuJgpUShyR94mCkVehUrslwm87I	rj1WYTe0280	KtUySPdgK6b50ygFra6Tv9HSOr3H4sO	tracker	IDSR Action Taken: Admitted?						f			\N	f		BOOLEAN	IDSR AT: Admitted?				bWW1WxiP9lY		\N	XjMhM0eneKI	rj1WYTe0280
202	KtUySPdgK6b50ygFra6Tv9HSOr3H4sO	1	Action Taken: Quarantine?	data	[{"id":"8c3ppw3MyR9w7vvvDCei78sgqYEfQ9u","title":"Yes","response":"1","value":true},{"id":"3IiKjsaD74LVoRsvvehqThDod6wSx0j","title":"No","response":"2","value":false}]	uM1pACv0LeUmqxbnYaNFMvOBPxB2sDE	uzrHtpkbkl7	jONbOiM3PYsg7NqcUXUxZ4X26j3XPGj	tracker	IDSR Action Taken: Quarantine?						f			\N	f		BOOLEAN	IDSR AT: Quarantine				bWW1WxiP9lY		\N	XjMhM0eneKI	uzrHtpkbkl7
203	jONbOiM3PYsg7NqcUXUxZ4X26j3XPGj	1	Action Taken: Investigation?	data	[{"id":"GzG5Wd98kmApJQT81p6xv6o2gE1vdSv","title":"Yes","response":"1","value":true},{"id":"GNYQK3aEPWvGIkCIzhXXKVC5xjHcAGD","title":"No","response":"2","value":false}]	KtUySPdgK6b50ygFra6Tv9HSOr3H4sO	ktm7DdZK6M8	oiRzg1QMuvp8rCRApPIXObJUEw4VRR9	tracker	IDSR Action Taken: Investigation						f			\N	f		BOOLEAN	IDSR AT: Investigation				bWW1WxiP9lY		\N	XjMhM0eneKI	ktm7DdZK6M8
204	oiRzg1QMuvp8rCRApPIXObJUEw4VRR9	1	Action Taken: Contact Tracing	data	[{"id":"YQD0LBpFVAEMg9cBvVVjd8KtVqlURxd","title":"Yes","response":"1","value":true},{"id":"zkJX3tNMQXJZXTrR3a0j0F9jJq9SeaV","title":"No","response":"2","value":false}]	jONbOiM3PYsg7NqcUXUxZ4X26j3XPGj	hK09K0f7F4N	2TYvckK2fnTQwz0k0p7BjAecUBpnkqU	tracker	IDSR Action Taken: Contact Tracing						f			\N	f		BOOLEAN	IDSR AT: Cont tracing				bWW1WxiP9lY		\N	XjMhM0eneKI	hK09K0f7F4N
205	0muasjn8FvzCWjafZuFXWt9IBCUTYDh	1	Select disease	data	[{"id":"Gxw7uw4owZn","title":"B05.9-Measles ","response":"1","value":"B05.9-Measles "},{"id":"F9sKDzneaFX","title":"Human influenza caused by new subtypes","response":"2","value":"Human influenza caused by new subtypes"},{"id":"wzixoWuc1le","title":"Maternal Death","response":"3","value":"Maternal Death","next_menu":"50VgnSKK9m7kAJ6HWrQ0OIgseiaxhor"},{"id":"LSAaYcnYnkr","title":"Neonatal Tetanus","response":"4","value":"Neonatal Tetanus"},{"id":"e5HRQS2bRV3","title":"Plague","response":"5","value":"Plague"}]	NVd4wtTY1i4sYAtMJzedU1EXfblkd2n	Of2oRqwosOB	Nd9g7wh8E3zyaM0HW54rgdGiEB9K4zc	event	IDSR Disease						f			\N	f		TEXT	IDSR Disease	Of2oRqwosOB			Rt3ZfijCNSR	oIfXzXib4AE	\N	\N	\N
206	Nd9g7wh8E3zyaM0HW54rgdGiEB9K4zc	1	Enter number of days since symptoms	data	[]	0muasjn8FvzCWjafZuFXWt9IBCUTYDh	VhU1TQa5hJV	LoH1YJmykE8m0ZJlh4Gp6lDihv0xLDX	event	IDSR Number of days since symptoms						f			\N	f		INTEGER_POSITIVE	IDSR Days since symptoms	VhU1TQa5hJV			Rt3ZfijCNSR	oIfXzXib4AE	\N	\N	\N
207	LoH1YJmykE8m0ZJlh4Gp6lDihv0xLDX	1	Choose Patient Age Type	data	[{"id":"gROcyTVfL8h","title":"Days","response":"1","value":"Days"},{"id":"vW2sozl2oPn","title":"Months","response":"2","value":"Months"},{"id":"zpdLUDfUUxt","title":"Years","response":"3","value":"Years"}]	Nd9g7wh8E3zyaM0HW54rgdGiEB9K4zc	JJkV68Devly	qXFkg4gBZ4sbPfF9u25J8HkDx6Zcj8p	event	Age Type						f			\N	f		TEXT	Age Type	JJkV68Devly			Rt3ZfijCNSR	oIfXzXib4AE	\N	\N	\N
208	qXFkg4gBZ4sbPfF9u25J8HkDx6Zcj8p	1	Enter Patient Age	data	[]	LoH1YJmykE8m0ZJlh4Gp6lDihv0xLDX	wtS5qShG6FX	WCju0cbTngM4PBexRN1hRcEPvIdhtQw	event	IDSR Patient Age						f			\N	f		INTEGER_POSITIVE	IDSR Patient Age	wtS5qShG6FX			Rt3ZfijCNSR	oIfXzXib4AE	\N	\N	\N
209	WCju0cbTngM4PBexRN1hRcEPvIdhtQw	1	Choose Patient Gender	data	[{"id":"k9uPFST6kxm","title":"Female","response":"1","value":"Female"},{"id":"sHZeC3hmKwG","title":"Male","response":"2","value":"Male"}]	qXFkg4gBZ4sbPfF9u25J8HkDx6Zcj8p	UjPZIq15xs1	YSJbPIjZxFfECYJqHZEDMRD95mOnCVF	event	Jinsia						f			\N	f		TEXT	Jinsia	UjPZIq15xs1			Rt3ZfijCNSR	oIfXzXib4AE	\N	\N	\N
210	YSJbPIjZxFfECYJqHZEDMRD95mOnCVF	1	Select Case definition	data	[{"id":"kK02ky0Z0pP","title":"Confirmed","response":"1","value":"Confirmed"},{"id":"AiiRMEPTuhr","title":"Probable","response":"2","value":"Probable"},{"id":"CVpB5Yveq0s","title":"Suspected","response":"3","value":"Suspected"}]	WCju0cbTngM4PBexRN1hRcEPvIdhtQw	IfRo0jcAZpB	cvxmb57ChyuASj5SZ0oHnmszFLLRCY5	event	IDSR Case Definition						f			\N	f		TEXT	IDSR Case Definition	IfRo0jcAZpB			Rt3ZfijCNSR	oIfXzXib4AE	\N	\N	\N
211	cvxmb57ChyuASj5SZ0oHnmszFLLRCY5	1	Was patient Vaccinated?	data	[{"id":"P9QrlSg3iDa","title":"No","response":"1","value":"No"},{"id":"qzHmwhHj9Sc","title":"Not Applicable","response":"2","value":"false"},{"id":"stS1n3ZPr2I","title":"Yes","response":"3","value":"Yes"}]	YSJbPIjZxFfECYJqHZEDMRD95mOnCVF	A5XfPG0F327	pjgCwS4aSXreibTO0zTXb4mBjGLiCwj	event	IDSR Was patient Vaccinated						f			\N	f		TEXT	IDSR patient vaccinated	A5XfPG0F327			Rt3ZfijCNSR	oIfXzXib4AE	\N	\N	\N
212	pjgCwS4aSXreibTO0zTXb4mBjGLiCwj	1	Was Lab specimen taken?	data	[{"id":"SsR7mHo2wKEZWjZXpZlSYQ49195bOVB","title":"Yes","response":"1","value":true},{"id":"lAzesIYREEd433m7S6VHBic3xwaK9IL","title":"No","response":"2","value":false,"next_menu":"Kiz1EkWf4EGRaSrHMGZg9x6obVTnAcy"}]	cvxmb57ChyuASj5SZ0oHnmszFLLRCY5	xL2l4FGfOiU	iw0854mmQExtMxm8DF7cPDFxV0Wkkc1	event	IDSR Was Lab specimen taken						f			\N	f		BOOLEAN	IDSR LabSpecimenTaken	xL2l4FGfOiU			Rt3ZfijCNSR	oIfXzXib4AE	\N	\N	\N
213	iw0854mmQExtMxm8DF7cPDFxV0Wkkc1	1	Where was specimen sent?	data	[{"id":"yGBNyTE3xsL","title":"Discarded","response":"1","value":"Discarded"},{"id":"Md8STGhrz8p","title":"District Lab","response":"2","value":"District Lab"},{"id":"NaADyB0u3XK","title":"National Lab","response":"3","value":"National Lab"},{"id":"YOPmcMcSc2D","title":"Regional Lab","response":"4","value":"Regional Lab"}]	pjgCwS4aSXreibTO0zTXb4mBjGLiCwj	H8ZNJvNZaGK	Kiz1EkWf4EGRaSrHMGZg9x6obVTnAcy	event	IDSR Where was specimen sent						f			\N	f		TEXT	IDSR WhereSpecimenSent	H8ZNJvNZaGK			Rt3ZfijCNSR	oIfXzXib4AE	\N	\N	\N
214	Kiz1EkWf4EGRaSrHMGZg9x6obVTnAcy	1	Is the patient alive?	data	[{"id":"k5otBURhO96QQRXYjCaVOlCvYVmOdv2","title":"Yes","response":"1","value":true},{"id":"Vz7cPQfeTWSONvyfqdzYL3bubzBKMI2","title":"No","response":"2","value":false,"next_menu":"JjtirPjioHsi7bbGpdnxXmm0yv3l1oF"}]	iw0854mmQExtMxm8DF7cPDFxV0Wkkc1	CP2jyL0meYd	NXAFqWscxIcYL5eIpDXTZVaqCcsOOGX	event	IDSR Is the patient alive						f			\N	f		BOOLEAN	IDSR is patient alive	CP2jyL0meYd			Rt3ZfijCNSR	oIfXzXib4AE	\N	\N	\N
215	NXAFqWscxIcYL5eIpDXTZVaqCcsOOGX	1	Patient status	data	[{"id":"anvzMd7xobk","title":"Admitted","response":"1","value":"Admitted"},{"id":"stoRl0yUgwO","title":"Discharged","response":"2","value":"Discharged"},{"id":"cQwAovxLRbn","title":"OPD","response":"3","value":"OPD"}]	Kiz1EkWf4EGRaSrHMGZg9x6obVTnAcy	QSFMWHHU1pk	QJSWjMaVrqOQIwcaiaRdZtbhptOQ37A	event	IDSR Patient status						f			\N	f		TEXT	IDSR Patient status	QSFMWHHU1pk			Rt3ZfijCNSR	oIfXzXib4AE	\N	\N	\N
280	tugXwRB7peGQvpFaVOkX75qtH1rQdeP	1	Disease Name: Malnutrition Death above 5 male	data	[]	f6jAvfFgWBI42EJUcSyfZNQSmlFaVbg	R9LUB5mvxCO.lW9u3eKdMXH	GiHXQEk2Saxt9R1UW9QOf0ndR09u7gX	aggregate	IDSR Malnutrition Death , > 5, ME						f			\N	f		INTEGER_ZERO_OR_POSITIVE	Malnutrition Death > 5 ME	R9LUB5mvxCO	lW9u3eKdMXH				\N	\N	\N
216	QJSWjMaVrqOQIwcaiaRdZtbhptOQ37A	1	Action Taken: Referred?	data	[{"id":"kl0LE77oqoehKh0qjkEWmEoG9hXZJZz","title":"Yes","response":"1","value":true},{"id":"5WSgJRcG5EA0z3qmHZv2O06rksNGirn","title":"No","response":"2","value":false}]	NXAFqWscxIcYL5eIpDXTZVaqCcsOOGX	H0BGXB6ZBA6	rof638ChibDWyoLQbOKmvGC8bDW0rYs	event	IDSR Action Taken: Referred?						f			\N	f		BOOLEAN	IDSR AT: Referred	H0BGXB6ZBA6			Rt3ZfijCNSR	oIfXzXib4AE	\N	\N	\N
217	rof638ChibDWyoLQbOKmvGC8bDW0rYs	1	Action Taken: Admitted?	data	[{"id":"3lhO0maMpgtpjXy9i9pmFuoHWU4K3TB","title":"Yes","response":"1","value":true},{"id":"ryaCAOPlwDDZpUlEkPSqbK83uc8JD7p","title":"No","response":"2","value":false}]	QJSWjMaVrqOQIwcaiaRdZtbhptOQ37A	v6BYZIjbQ5l	JjtirPjioHsi7bbGpdnxXmm0yv3l1oF	event	IDSR Action Taken: Admitted?						f			\N	f		BOOLEAN	IDSR AT: Admitted?	v6BYZIjbQ5l			Rt3ZfijCNSR	oIfXzXib4AE	\N	\N	\N
218	JjtirPjioHsi7bbGpdnxXmm0yv3l1oF	1	Action Taken: Quarantine?	data	[{"id":"MpXcoUzMnAOQk67UmnVW9E1DO0tG9M7","title":"Yes","response":"1","value":true},{"id":"pR9qvRu9EYuBUETepC1vPeWGRTA2Lbo","title":"No","response":"2","value":false}]	rof638ChibDWyoLQbOKmvGC8bDW0rYs	DvIvLGska4L	KXZ6Cl8QDUpQ1Z4rvMZ4SvDp33GoJyu	event	IDSR Action Taken: Quarantine?						f			\N	f		BOOLEAN	IDSR AT: Quarantine	DvIvLGska4L			Rt3ZfijCNSR	oIfXzXib4AE	\N	\N	\N
219	KXZ6Cl8QDUpQ1Z4rvMZ4SvDp33GoJyu	1	Action Taken: Investigation	data	[{"id":"AGuv4PUtDQ6LZNQR6N09FeMxCJBmRZg","title":"Yes","response":"1","value":true},{"id":"5tq1WokvmQc8lejkoJD3XOGYLTgSHO3","title":"No","response":"2","value":false}]	JjtirPjioHsi7bbGpdnxXmm0yv3l1oF	aBHgXkUZhBa	rm3972uwPuULs7mQ8LCtVCWe0QNejy6	event	IDSR Action Taken: Investigation						f			\N	f		BOOLEAN	IDSR AT: Investigation	aBHgXkUZhBa			Rt3ZfijCNSR	oIfXzXib4AE	\N	\N	\N
220	rm3972uwPuULs7mQ8LCtVCWe0QNejy6	1	Action Taken: Contact Tracing	data	[{"id":"4ECMlyqXE5Mg5iUX9Z99GLvpx29cOZ2","title":"Yes","response":"1","value":true},{"id":"z6xOfiO0ehlGrJCwUC6NMrbs7SaNgzR","title":"No","response":"2","value":false}]	KXZ6Cl8QDUpQ1Z4rvMZ4SvDp33GoJyu	x3bB0bwXUxf	p8TtKZ6z3j79wFngOTwoaIaLUlFPv5C	event	IDSR Action Taken: Contact Tracing						f			\N	f		BOOLEAN	IDSR AT: Cont tracing	x3bB0bwXUxf			Rt3ZfijCNSR	oIfXzXib4AE	\N	\N	\N
221	mRHwSMkOGBWBpTDXY1qzu6fz7t1NWbA	1	Enter number of days since symptoms began	data	[]	sWbxB4fanqRgj6LU4fPdRSGUG3ZBdGE	VhU1TQa5hJV	iwLFOUdWactQsbxVeuXHZo17pgqy1XL	event	IDSR Number of days since symptoms						f			\N	f		INTEGER_POSITIVE	IDSR Days since symptoms	VhU1TQa5hJV			Rt3ZfijCNSR	oIfXzXib4AE	\N	\N	\N
222	iwLFOUdWactQsbxVeuXHZo17pgqy1XL	1	Choose Patient Age Type	data	[{"id":"gROcyTVfL8h","title":"Days","response":"1","value":"Days"},{"id":"vW2sozl2oPn","title":"Months","response":"2","value":"Months"},{"id":"zpdLUDfUUxt","title":"Years","response":"3","value":"Years"}]	mRHwSMkOGBWBpTDXY1qzu6fz7t1NWbA	JJkV68Devly	IIDDxv1cEHhMeHWONEsRGgh9SSuTJnF	event	Age Type						f			\N	f		TEXT	Age Type	JJkV68Devly			Rt3ZfijCNSR	oIfXzXib4AE	\N	\N	\N
223	IIDDxv1cEHhMeHWONEsRGgh9SSuTJnF	1	Enter Patient Age (Numeric)	data	[]	iwLFOUdWactQsbxVeuXHZo17pgqy1XL	wtS5qShG6FX	Urrl5FT5GtSL5EvgGj5rR9FBUIelOOn	event	IDSR Patient Age						f			\N	f		INTEGER_POSITIVE	IDSR Patient Age	wtS5qShG6FX			Rt3ZfijCNSR	oIfXzXib4AE	\N	\N	\N
224	Urrl5FT5GtSL5EvgGj5rR9FBUIelOOn	1	Choose Patient Gender	data	[{"id":"k9uPFST6kxm","title":"Female","response":"1","value":"Female"},{"id":"sHZeC3hmKwG","title":"Male","response":"2","value":"Male"}]	IIDDxv1cEHhMeHWONEsRGgh9SSuTJnF	UjPZIq15xs1	qhmOeU1xv9BJU3PQm0mi9mS8JQjxFqB	event	Jinsia						f			\N	f		TEXT	Jinsia	UjPZIq15xs1			Rt3ZfijCNSR	oIfXzXib4AE	\N	\N	\N
225	qhmOeU1xv9BJU3PQm0mi9mS8JQjxFqB	1	 Select Case definition	data	[{"id":"kK02ky0Z0pP","title":"Confirmed","response":"1","value":"Confirmed"},{"id":"AiiRMEPTuhr","title":"Probable","response":"2","value":"Probable"},{"id":"CVpB5Yveq0s","title":"Suspected","response":"3","value":"Suspected"}]	Urrl5FT5GtSL5EvgGj5rR9FBUIelOOn	IfRo0jcAZpB	C7njalgWy8DSBsvEU50QW418pITM85H	event	IDSR Case Definition						f			\N	f		TEXT	IDSR Case Definition	IfRo0jcAZpB			Rt3ZfijCNSR	oIfXzXib4AE	\N	\N	\N
226	C7njalgWy8DSBsvEU50QW418pITM85H	1	Was Patient Vaccinated?	data	[{"id":"P9QrlSg3iDa","title":"No","response":"1","value":"No"},{"id":"qzHmwhHj9Sc","title":"Not Applicable","response":"2","value":"false"},{"id":"stS1n3ZPr2I","title":"Yes","response":"3","value":"Yes"}]	qhmOeU1xv9BJU3PQm0mi9mS8JQjxFqB	A5XfPG0F327	5vUQM0llFI7v3jQkentWaL7PRlmgmCY	event	IDSR Was patient Vaccinated						f			\N	f		TEXT	IDSR patient vaccinated	A5XfPG0F327			Rt3ZfijCNSR	oIfXzXib4AE	\N	\N	\N
227	5vUQM0llFI7v3jQkentWaL7PRlmgmCY	1	Was Lab specimen taken?	data	[{"id":"hy8aIvR92eX4bus2mbP3LS512k7JwOK","title":"Yes","response":"1","value":true},{"id":"bqjeIUtD1eftHgceQMhvi5KSHyMhDe5","title":"No","response":"2","value":false,"next_menu":"Kiz1EkWf4EGRaSrHMGZg9x6obVTnAcy"}]	C7njalgWy8DSBsvEU50QW418pITM85H	xL2l4FGfOiU	njx9BmfXPtr0rFOT3ubSbpl7qBxmCdH	event	IDSR Was Lab specimen taken						f			\N	f		BOOLEAN	IDSR LabSpecimenTaken	xL2l4FGfOiU			Rt3ZfijCNSR	oIfXzXib4AE	\N	\N	\N
228	njx9BmfXPtr0rFOT3ubSbpl7qBxmCdH	1	Where was specimen sent?	data	[{"id":"yGBNyTE3xsL","title":"Discarded","response":"1","value":"Discarded"},{"id":"Md8STGhrz8p","title":"District Lab","response":"2","value":"District Lab"},{"id":"NaADyB0u3XK","title":"National Lab","response":"3","value":"National Lab"},{"id":"YOPmcMcSc2D","title":"Regional Lab","response":"4","value":"Regional Lab"}]	5vUQM0llFI7v3jQkentWaL7PRlmgmCY	H8ZNJvNZaGK	4EXFODhEkbYXRAJnTvf59VUdprGQX3o	event	IDSR Where was specimen sent						f			\N	f		TEXT	IDSR WhereSpecimenSent	H8ZNJvNZaGK			Rt3ZfijCNSR	oIfXzXib4AE	\N	\N	\N
229	4EXFODhEkbYXRAJnTvf59VUdprGQX3o	1	 Is the patient alive?	data	[{"id":"dFcbaj9GMX9N5f42VPKWGtxfwhaGz8I","title":"Yes","response":"1","value":true},{"id":"Ho3NPF3WVChczNxsQdy32tD2OqdggUr","title":"No","response":"2","value":false,"next_menu":"JjtirPjioHsi7bbGpdnxXmm0yv3l1oF"}]	njx9BmfXPtr0rFOT3ubSbpl7qBxmCdH	CP2jyL0meYd	X0h0VV3faZK1N5TRXzSqrBKNA5vLuNp	event	IDSR Is the patient alive						f			\N	f		BOOLEAN	IDSR is patient alive	CP2jyL0meYd			Rt3ZfijCNSR	oIfXzXib4AE	\N	\N	\N
230	X0h0VV3faZK1N5TRXzSqrBKNA5vLuNp	1	Patient status	data	[{"id":"anvzMd7xobk","title":"Admitted","response":"1","value":"Admitted"},{"id":"stoRl0yUgwO","title":"Discharged","response":"2","value":"Discharged"},{"id":"cQwAovxLRbn","title":"OPD","response":"3","value":"OPD"}]	4EXFODhEkbYXRAJnTvf59VUdprGQX3o	QSFMWHHU1pk	ZPli8HGijOy9DZi8gIjymrhbqvUx8Sj	event	IDSR Patient status						f			\N	f		TEXT	IDSR Patient status	QSFMWHHU1pk			Rt3ZfijCNSR	oIfXzXib4AE	\N	\N	\N
231	ZPli8HGijOy9DZi8gIjymrhbqvUx8Sj	1	Action Taken: Patient Referred?	data	[{"id":"6CiTv5PDWY2ESw28vwfaurhP84Z4XS7","title":"Yes","response":"1","value":true},{"id":"xTkNpGiqkfZjEtLyuGIiaiF1RUVs9y0","title":"No","response":"2","value":false}]	X0h0VV3faZK1N5TRXzSqrBKNA5vLuNp	H0BGXB6ZBA6	KK8RTcsjq1lFLqo8F76aXzSu1Q8Wxeh	event	IDSR Action Taken: Referred?						f			\N	f		BOOLEAN	IDSR AT: Referred	H0BGXB6ZBA6			Rt3ZfijCNSR	oIfXzXib4AE	\N	\N	\N
232	KK8RTcsjq1lFLqo8F76aXzSu1Q8Wxeh	1	Action Taken: Patient Admitted?	data	[{"id":"fwbkkU034OoPGIXGs2Fo57LkYOI6wY6","title":"Yes","response":"1","value":true},{"id":"LbV1m40Q4rOnBc4ke52y4ocGpoD5Mb4","title":"No","response":"2","value":false}]	ZPli8HGijOy9DZi8gIjymrhbqvUx8Sj	v6BYZIjbQ5l	J4QCNnvmXlIMvaf9jI7bBSwhQqgSlaQ	event	IDSR Action Taken: Admitted?						f			\N	f		BOOLEAN	IDSR AT: Admitted?	v6BYZIjbQ5l			Rt3ZfijCNSR	oIfXzXib4AE	\N	\N	\N
233	J4QCNnvmXlIMvaf9jI7bBSwhQqgSlaQ	1	Action Taken: Quarantine?	data	[{"id":"lWYPNhRZU4xlP7VnDGluukIRMj0exzn","title":"Yes","response":"1","value":true},{"id":"cD5mW7PZAFQExSj7XLHipeQTLC5plL1","title":"No","response":"2","value":false}]	KK8RTcsjq1lFLqo8F76aXzSu1Q8Wxeh	DvIvLGska4L	Bi0quHLffe3OVjnd4w3G3AAOzP1xa8Z	event	IDSR Action Taken: Quarantine?						f			\N	f		BOOLEAN	IDSR AT: Quarantine	DvIvLGska4L			Rt3ZfijCNSR	oIfXzXib4AE	\N	\N	\N
234	Bi0quHLffe3OVjnd4w3G3AAOzP1xa8Z	1	Action Taken: Investigation done?	data	[{"id":"DHbB9iQOnbHwI3lbfjbPQIxTqnrIjvz","title":"Yes","response":"1","value":true},{"id":"CWUI6Z0zZY3l2lzT5rphP8rxDj5ovRF","title":"No","response":"2","value":false}]	J4QCNnvmXlIMvaf9jI7bBSwhQqgSlaQ	aBHgXkUZhBa	mnuIXHpp1CJqLYgnLsz2NnD7jSpqrO9	event	IDSR Action Taken: Investigation						f			\N	f		BOOLEAN	IDSR AT: Investigation	aBHgXkUZhBa			Rt3ZfijCNSR	oIfXzXib4AE	\N	\N	\N
235	mnuIXHpp1CJqLYgnLsz2NnD7jSpqrO9	1	Action Taken: Contact Tracing	data	[{"id":"6pqmt2ujCbDgl8ZmIFoaKKcBViPZiLc","title":"Yes","response":"1","value":true},{"id":"IDDvvhh0TYnSKgtQNCoXP40MIoosz0l","title":"No","response":"2","value":false}]	Bi0quHLffe3OVjnd4w3G3AAOzP1xa8Z	x3bB0bwXUxf	ghIkgNJC0FsrGJfpuUa2PfCoFBCrIHU	event	IDSR Action Taken: Contact Tracing						f			\N	f		BOOLEAN	IDSR AT: Cont tracing	x3bB0bwXUxf			Rt3ZfijCNSR	oIfXzXib4AE	\N	\N	\N
236	Vh15JSspt0JYUvjaU2ag5ZxIX1EJcVB	1	Enter Epidemiological week number	period	[]	peKiGAl2jiM3yglJ8CduJlUHRkbIr4C		bc6CffAmCdCBfwTPLP3a9TPVYIoG0G5						3		f		Weekly	52	f									\N	\N	\N
237	bc6CffAmCdCBfwTPLP3a9TPVYIoG0G5	1	Enter Year	period	[]	Vh15JSspt0JYUvjaU2ag5ZxIX1EJcVB		vS1HlGTUeDwps5JivGLRxGQEXdLBv5G						3		f			\N	t	3								\N	\N	\N
238	vS1HlGTUeDwps5JivGLRxGQEXdLBv5G	1	Select Disease	options	[{"id":"05LpEWXpwoIaYJg9APvyMKkxCkKsEgX","title":"Malaria","response":"1","next_menu":"kIQAck7WHUHtUgov2BljAm7yiBjn6Pz"},{"id":"VaTKeUuro1Eo00QABDwOAxpWrXcHuuE","title":"Pneumonia","response":"2","next_menu":"ROFhQseO8HYXzPH9Cj1NmX8cgNbaZ1n"},{"id":"NN2hhYcbEjByi1BdzubeKS2oKpW7sTD","title":"Mal nutrition","response":"3","next_menu":""}]	bc6CffAmCdCBfwTPLP3a9TPVYIoG0G5										f			\N	f									\N	\N	\N
239	kIQAck7WHUHtUgov2BljAm7yiBjn6Pz	1	IDSR Malaria Cases Case, < 5	data	[]	vS1HlGTUeDwps5JivGLRxGQEXdLBv5G	mbN5Ha1T6Dx.rphvCz1EY6I	ZIZJOlTDMSfGOIRLMBp1z89cGj08naP	aggregate	IDSR Malaria Cases Case, < 5						f			\N	f		INTEGER_ZERO_OR_POSITIVE	Malaria Cases Case < 5	mbN5Ha1T6Dx	rphvCz1EY6I				\N	\N	\N
240	ZIZJOlTDMSfGOIRLMBp1z89cGj08naP	1	IDSR Malaria Cases Case, > 5	data	[]	kIQAck7WHUHtUgov2BljAm7yiBjn6Pz	mbN5Ha1T6Dx.vPuWSFjehIm	geVnBQdm6vBMgcQGAYbp30lusCrPWtF	aggregate	IDSR Malaria Cases Case, > 5						f			\N	f		INTEGER_ZERO_OR_POSITIVE	Malaria Cases Case > 5	mbN5Ha1T6Dx	vPuWSFjehIm				\N	\N	\N
241	geVnBQdm6vBMgcQGAYbp30lusCrPWtF	1	IDSR Malaria Tested Positive Case, < 5	data	[]	ZIZJOlTDMSfGOIRLMBp1z89cGj08naP	aTBq63q6SGs.rphvCz1EY6I	c7nvDAHEzcnxjzLMdVSry7T9ZFP891C	aggregate	IDSR Malaria Tested Positive Case, < 5						f			\N	f		INTEGER_ZERO_OR_POSITIVE	Malaria Tested +ve Case < 5	aTBq63q6SGs	rphvCz1EY6I				\N	\N	\N
242	c7nvDAHEzcnxjzLMdVSry7T9ZFP891C	1	IDSR Malaria Tested Positive Case, > 5	data	[]	geVnBQdm6vBMgcQGAYbp30lusCrPWtF	aTBq63q6SGs.vPuWSFjehIm	JbzD2X2aPaC7cIVkbMwvUZJlxl4Fi7A	aggregate	IDSR Malaria Tested Positive Case, > 5						f			\N	f		INTEGER_ZERO_OR_POSITIVE	Malaria Tested +ve Case > 5	aTBq63q6SGs	vPuWSFjehIm				\N	\N	\N
243	JbzD2X2aPaC7cIVkbMwvUZJlxl4Fi7A	1	IDSR Malaria Clinical Cases Case, < 5	data	[]	c7nvDAHEzcnxjzLMdVSry7T9ZFP891C	hGXnKNp7HW6.rphvCz1EY6I	xsn44LCuVQDfEjsS324c40ImxNNlmEN	aggregate	IDSR Malaria Clinical Cases Case, < 5						f			\N	f		INTEGER_ZERO_OR_POSITIVE	Malaria Clinical Case < 5	hGXnKNp7HW6	rphvCz1EY6I				\N	\N	\N
244	xsn44LCuVQDfEjsS324c40ImxNNlmEN	1	IDSR Malaria Clinical Cases Case, > 5	data	[]	JbzD2X2aPaC7cIVkbMwvUZJlxl4Fi7A	hGXnKNp7HW6.vPuWSFjehIm	cUZXVU8OA8970c9rmA6LrbYdWZhzcxf	aggregate	IDSR Malaria Clinical Cases Case, > 5						f			\N	f		INTEGER_ZERO_OR_POSITIVE	Malaria Clinical Case > 5	hGXnKNp7HW6	vPuWSFjehIm				\N	\N	\N
245	cUZXVU8OA8970c9rmA6LrbYdWZhzcxf	1	Report for Year	period	[]	xsn44LCuVQDfEjsS324c40ImxNNlmEN		VPa1jZMmHn0wkem3OOvXQigmXX42W4k						3		f			\N	t	2								\N	\N	\N
246	VPa1jZMmHn0wkem3OOvXQigmXX42W4k	1	Enter 1 to Confirm or 2 to Cancel	options	[{"id":"TMnXpuN281RW1Aunk4K4Jf5SPmCwXoy","title":"Confirm","response":"1","next_menu":"cSrCQaxOt3N6oZDS1xUUp1oRtgUH7nn"},{"id":"hBPJGdQkDNHd6csVCg6XPQTYjMOf271","title":"Cancel","response":"2","next_menu":"c1rlNzImXbEBBOFO8lr5fFSCCed2SQu"}]	cUZXVU8OA8970c9rmA6LrbYdWZhzcxf										f			\N	f									\N	\N	\N
247	cSrCQaxOt3N6oZDS1xUUp1oRtgUH7nn	1	Thanks data captured and saved	message	[]	VPa1jZMmHn0wkem3OOvXQigmXX42W4k										f			\N	f									\N	\N	\N
248	ROFhQseO8HYXzPH9Cj1NmX8cgNbaZ1n	1	New Menu		[]	vS1HlGTUeDwps5JivGLRxGQEXdLBv5G										f			\N	f									\N	\N	\N
249	c1rlNzImXbEBBOFO8lr5fFSCCed2SQu	1	Request cancelled	message	[]	VPa1jZMmHn0wkem3OOvXQigmXX42W4k										f			\N	f									\N	\N	\N
250	HwHi9v648m2QathM0Abcoz406C70R1S	1	Enter Epidemiological week number	period	[]	peKiGAl2jiM3yglJ8CduJlUHRkbIr4C		oYQFfbbJOaqvj32FSGXaxpJ7qc0GVxN						3		f		Weekly	52	f									\N	\N	\N
251	oYQFfbbJOaqvj32FSGXaxpJ7qc0GVxN	1	Select disease group	options	[{"id":"32wsP6W2lRLjkMeNxjm3XVZ5TovkQ9i","title":"Public health importance","response":"1","next_menu":"Ll77OPIYo1N9Xu9SrdprVcueYivRVBG"},{"id":"sxhZYik4UbGy6Pmt2cwvZwn02EITuEB","title":"Malaria","response":"2","next_menu":"TgQYWMh45LL3yJC9EJR0yUvrNjRqNqG"}]	HwHi9v648m2QathM0Abcoz406C70R1S										f			\N	f									\N	\N	\N
252	TgQYWMh45LL3yJC9EJR0yUvrNjRqNqG	1	Disease Name: Malaria Tested Cases under 5	data	[]	oYQFfbbJOaqvj32FSGXaxpJ7qc0GVxN	Jl5fGRORobn.rphvCz1EY6I	BXjeYoo780ncFVV35CAfvG2dhLjCtlV	aggregate	IDSR Malaria Tested (Lab/MRDT) Cases Case, < 5						f			\N	f		INTEGER_ZERO_OR_POSITIVE	Malaria Tested Case < 5	Jl5fGRORobn	rphvCz1EY6I				\N	\N	\N
253	BXjeYoo780ncFVV35CAfvG2dhLjCtlV	1	Disease Name: Malaria Tested Cases  above  5	data	[]	TgQYWMh45LL3yJC9EJR0yUvrNjRqNqG	Jl5fGRORobn.vPuWSFjehIm	yY5byrnU8gMlcALD81speZcRtgx5RAf	aggregate	IDSR Malaria Tested (Lab/MRDT) Cases Case, > 5						f			\N	f		INTEGER_ZERO_OR_POSITIVE	Malaria Tested Case > 5	Jl5fGRORobn	vPuWSFjehIm				\N	\N	\N
254	yY5byrnU8gMlcALD81speZcRtgx5RAf	1	Disease Name: Malaria Tested Positive Case under 5	data	[]	BXjeYoo780ncFVV35CAfvG2dhLjCtlV	aTBq63q6SGs.rphvCz1EY6I	iryrk8igRomlWGqccRkxWz5NFVvXciz	aggregate	IDSR Malaria Tested Positive Case, < 5						f			\N	f		INTEGER_ZERO_OR_POSITIVE	Malaria Tested +ve Case < 5	aTBq63q6SGs	rphvCz1EY6I				\N	\N	\N
255	iryrk8igRomlWGqccRkxWz5NFVvXciz	1	Disease Name: Malaria Tested Positive Case above 5	data	[]	yY5byrnU8gMlcALD81speZcRtgx5RAf	aTBq63q6SGs.vPuWSFjehIm	bnL2F5HOC4siFMadmIb8b7hRNdbyrCg	aggregate	IDSR Malaria Tested Positive Case, > 5						f			\N	f		INTEGER_ZERO_OR_POSITIVE	Malaria Tested +ve Case > 5	aTBq63q6SGs	vPuWSFjehIm				\N	\N	\N
256	bnL2F5HOC4siFMadmIb8b7hRNdbyrCg	1	Disease Name: Malaria Clinical Cases under 5	data	[]	iryrk8igRomlWGqccRkxWz5NFVvXciz	hGXnKNp7HW6.rphvCz1EY6I	IHJylUZeSD4PXmEGRA2GbZmlCepE7cX	aggregate	IDSR Malaria Clinical Cases Case, < 5						f			\N	f		INTEGER_ZERO_OR_POSITIVE	Malaria Clinical Case < 5	hGXnKNp7HW6	rphvCz1EY6I				\N	\N	\N
259	Ll77OPIYo1N9Xu9SrdprVcueYivRVBG	1	Select Disease	options	[{"id":"Px85YwHPbrQHnHnoP3hUCa5ntb4f0FD","title":"Animal bites","response":"1","next_menu":"LwhgwBmMzXEuXE9bUl0GjylPYbzEE5Y"},{"id":"GqQTDOqafCssSskzVuN5ria0rbqvc7o","title":"Diarrhoea","response":"2","next_menu":"14JdioYCYR46wu02LJkMwROfFgQA9bt"},{"id":"wGpxfGcs3ExFmbpL33zUIukTjCuY6IN","title":"Malnutrition","response":"3","next_menu":"4CfVzoaghNi2DQbUflxvRKEWXhMUBce"},{"id":"iU26DWOSP8Nh6GHjNfeuE615Ogrk21V","title":"Onchocerciasis","response":"4","next_menu":"BeMuQcZMeVoyxcaVoLfjvG9B3VVCt8Q"},{"id":"ML88SYndW06Wr4vATFKPUH3K7TxOB2m","title":"Pneumonia","response":"5","next_menu":"NKEshpLwsi0GFln5KI3wD9wmDjaffcA"},{"id":"fED6M25rjMvUJ1kq99O8hJmGbeelG4m","title":"Tick borne r.fever","response":"6","next_menu":"DhUG0hVrUbQa2usfoqHbww9XzqzqDPF"},{"id":"05donyetmZqLdV3j1ZuCecZ6rNsDdQ8","title":"Trachoma","response":"7","next_menu":"aGdul9kpBDup8dXDoeEkCXHAKTPC9UU"},{"id":"77Vi9KZ4w5YKeehGNrMXiUsK9v88wvU","title":"Trypanosomiasis","response":"8","next_menu":"alhfdsoBTAmaWT67xrIgrlh7sJLfUvv"},{"id":"Xr0sXTFRs4UhU80cQV8gg7blXFnap9j","title":"Typhoid","response":"9","next_menu":"C51PbFkxhojEEPiCoRr9i3vSRsLhu84"}]	oYQFfbbJOaqvj32FSGXaxpJ7qc0GVxN										f			\N	f									\N	\N	\N
260	LwhgwBmMzXEuXE9bUl0GjylPYbzEE5Y	1	 Disease Name: Animal Bites Case under 5, Male	data	[]	Ll77OPIYo1N9Xu9SrdprVcueYivRVBG	nrmGMpeTMpK.AttDwO4xCIu	eueBaBsofKYAftMqiV5GbfbdEPKXe6o	aggregate	IDSR Animal Bites Case, < 5, ME						f			\N	f		INTEGER_ZERO_OR_POSITIVE	Animal Bites Case < 5 ME	nrmGMpeTMpK	AttDwO4xCIu				\N	\N	\N
261	eueBaBsofKYAftMqiV5GbfbdEPKXe6o	1	 Disease Name: Animal Bites Case under  5 female	data	[]	LwhgwBmMzXEuXE9bUl0GjylPYbzEE5Y	nrmGMpeTMpK.QInmZugn9JO	KASCTTBtN0HtfRCqTT6nSKAv0UMnqKr	aggregate	IDSR Animal Bites Case, < 5, KE						f			\N	f		INTEGER_ZERO_OR_POSITIVE	Animal Bites Case < 5 KE	nrmGMpeTMpK	QInmZugn9JO				\N	\N	\N
262	KASCTTBtN0HtfRCqTT6nSKAv0UMnqKr	1	Disease Name: Animal Bites Death under 5 male	data	[]	eueBaBsofKYAftMqiV5GbfbdEPKXe6o	nrmGMpeTMpK.LZsl9VW71qr	E8LhqAWJFvdhox8NXlEGtrz3ejnwbQQ	aggregate	IDSR Animal Bites Death , < 5, ME						f			\N	f		INTEGER_ZERO_OR_POSITIVE	Animal Bites Death < 5 ME	nrmGMpeTMpK	LZsl9VW71qr				\N	\N	\N
263	E8LhqAWJFvdhox8NXlEGtrz3ejnwbQQ	1	 Disease Name: Animal Bites Death under 5 female	data	[]	KASCTTBtN0HtfRCqTT6nSKAv0UMnqKr	nrmGMpeTMpK.ifRTBcyGzHU	5ZN8lz5XNyEIaBML8dfdxelheyDhkjP	aggregate	IDSR Animal Bites Death , < 5, KE						f			\N	f		INTEGER_ZERO_OR_POSITIVE	Animal Bites Death < 5 KE	nrmGMpeTMpK	ifRTBcyGzHU				\N	\N	\N
264	5ZN8lz5XNyEIaBML8dfdxelheyDhkjP	1	Disease Name: Animal Bites Case above 5 male	data	[]	E8LhqAWJFvdhox8NXlEGtrz3ejnwbQQ	nrmGMpeTMpK.FRzeEpefSK8	wj43DMmJUnVHHqKc8LJNIsj0W9ImNHv	aggregate	IDSR Animal Bites Case, > 5, ME						f			\N	f		INTEGER_ZERO_OR_POSITIVE	Animal Bites Case > 5 ME	nrmGMpeTMpK	FRzeEpefSK8				\N	\N	\N
265	wj43DMmJUnVHHqKc8LJNIsj0W9ImNHv	1	Disease Name: Animal Bites Case above 5 female	data	[]	5ZN8lz5XNyEIaBML8dfdxelheyDhkjP	nrmGMpeTMpK.q3GdT7f6iw9	8XIa9d3FyiJQlQMXLXrltNcouIBwFjD	aggregate	IDSR Animal Bites Case, > 5, KE						f			\N	f		INTEGER_ZERO_OR_POSITIVE	Animal Bites Case > 5 KE	nrmGMpeTMpK	q3GdT7f6iw9				\N	\N	\N
266	8XIa9d3FyiJQlQMXLXrltNcouIBwFjD	1	Disease Name: Animal Bites Death above 5 male	data	[]	wj43DMmJUnVHHqKc8LJNIsj0W9ImNHv	nrmGMpeTMpK.lW9u3eKdMXH	ShFsYgVYt2BUzEkQYOsgpyir1qJvE3R	aggregate	IDSR Animal Bites Death , > 5, ME						f			\N	f		INTEGER_ZERO_OR_POSITIVE	Animal Bites Death > 5 ME	nrmGMpeTMpK	lW9u3eKdMXH				\N	\N	\N
267	ShFsYgVYt2BUzEkQYOsgpyir1qJvE3R	1	 Disease Name: Animal Bites Death above 5 female	data	[]	8XIa9d3FyiJQlQMXLXrltNcouIBwFjD	nrmGMpeTMpK.Q8U3fXSfxY8	zGM7j5Vp6cYzjjyuklgvi6wCsmK7nF0	aggregate	IDSR Animal Bites Death , > 5, KE						f			\N	f		INTEGER_ZERO_OR_POSITIVE	Animal Bites Death > 5 KE	nrmGMpeTMpK	Q8U3fXSfxY8				\N	\N	\N
268	zGM7j5Vp6cYzjjyuklgvi6wCsmK7nF0	1	Disease Name: Animal Bites Report for Year	period	[]	ShFsYgVYt2BUzEkQYOsgpyir1qJvE3R		HAopKCo7DhtssaFHVyLHoYTf41PMhKb						3		f			\N	t	1								\N	\N	\N
269	14JdioYCYR46wu02LJkMwROfFgQA9bt	1	Disease Name: Diarrhoea case under 5 male	data	[]	Ll77OPIYo1N9Xu9SrdprVcueYivRVBG	kXD4hg575gJ.AttDwO4xCIu	WVx0x3VKYda0AwD3EP5MeAYkCCnTNEE	aggregate	IDSR Diarrhoea <5 Years Case, < 5, ME						f			\N	f		INTEGER_ZERO_OR_POSITIVE	Diarrhoea Case < 5 ME	kXD4hg575gJ	AttDwO4xCIu				\N	\N	\N
270	WVx0x3VKYda0AwD3EP5MeAYkCCnTNEE	1	Disease Name: Diarrhoea case under 5  female	data	[]	14JdioYCYR46wu02LJkMwROfFgQA9bt	kXD4hg575gJ.QInmZugn9JO	tlaahS22pxpBR9478vl59feLNS8ldlh	aggregate	IDSR Diarrhoea <5 Years Case, < 5, KE						f			\N	f		INTEGER_ZERO_OR_POSITIVE	Diarrhoea Case < 5 KE	kXD4hg575gJ	QInmZugn9JO				\N	\N	\N
271	tlaahS22pxpBR9478vl59feLNS8ldlh	1	Disease Name: Diarrhoea deaths under 5 male	data	[]	WVx0x3VKYda0AwD3EP5MeAYkCCnTNEE	kXD4hg575gJ.LZsl9VW71qr	dy8dnMCT6216hHfWNUm5GIakBRaiMEz	aggregate	IDSR Diarrhoea <5 Years Death , < 5, ME						f			\N	f		INTEGER_ZERO_OR_POSITIVE	Diarrhoea Death < 5 ME	kXD4hg575gJ	LZsl9VW71qr				\N	\N	\N
272	dy8dnMCT6216hHfWNUm5GIakBRaiMEz	1	Disease Name: Diarrhoea deaths under 5 female	data	[]	tlaahS22pxpBR9478vl59feLNS8ldlh	kXD4hg575gJ.ifRTBcyGzHU	FWSBvNnHuSvEKJx4UWdQFvS3Q6hkyOV	aggregate	IDSR Diarrhoea <5 Years Death , < 5, KE						f			\N	f		INTEGER_ZERO_OR_POSITIVE	Diarrhoea Death < 5 KE	kXD4hg575gJ	ifRTBcyGzHU				\N	\N	\N
273	FWSBvNnHuSvEKJx4UWdQFvS3Q6hkyOV	1	Disease Name: Diarrhoea Report for Year 	period	[]	dy8dnMCT6216hHfWNUm5GIakBRaiMEz		ePAMb9OVPSsPFqw15cbr76HoQ9WalTp						3		f			\N	t	1								\N	\N	\N
274	4CfVzoaghNi2DQbUflxvRKEWXhMUBce	1	Disease Name: Malnutrition Case under 5 male	data	[]	Ll77OPIYo1N9Xu9SrdprVcueYivRVBG	R9LUB5mvxCO.AttDwO4xCIu	tYYJWOmD41Ua60zzwAJradNSQiT0vZy	aggregate	IDSR Malnutrition Case, < 5, ME						f			\N	f		INTEGER_ZERO_OR_POSITIVE	Malnutrition Case < 5 ME	R9LUB5mvxCO	AttDwO4xCIu				\N	\N	\N
275	tYYJWOmD41Ua60zzwAJradNSQiT0vZy	1	Disease Name: Malnutrition Case under 5 female	data	[]	4CfVzoaghNi2DQbUflxvRKEWXhMUBce	R9LUB5mvxCO.QInmZugn9JO	RhtX0rDowFoviofkcRdNihtUKzrtbsD	aggregate	IDSR Malnutrition Case, < 5, KE						f			\N	f		INTEGER_ZERO_OR_POSITIVE	Malnutrition Case < 5 KE	R9LUB5mvxCO	QInmZugn9JO				\N	\N	\N
276	RhtX0rDowFoviofkcRdNihtUKzrtbsD	1	Disease Name: Malnutrition Death under 5 male	data	[]	tYYJWOmD41Ua60zzwAJradNSQiT0vZy	R9LUB5mvxCO.LZsl9VW71qr	bPljCnv89cKAC2lM5KJ84hBYILxId9d	aggregate	IDSR Malnutrition Death , < 5, ME						f			\N	f		INTEGER_ZERO_OR_POSITIVE	Malnutrition Death < 5 ME	R9LUB5mvxCO	LZsl9VW71qr				\N	\N	\N
277	bPljCnv89cKAC2lM5KJ84hBYILxId9d	1	Disease Name: Malnutrition Death under 5 female	data	[]	RhtX0rDowFoviofkcRdNihtUKzrtbsD	R9LUB5mvxCO.ifRTBcyGzHU	Vog3jPigUZLWQG5J24SPMVxCY4mVeqA	aggregate	IDSR Malnutrition Death , < 5, KE						f			\N	f		INTEGER_ZERO_OR_POSITIVE	Malnutrition Death < 5 KE	R9LUB5mvxCO	ifRTBcyGzHU				\N	\N	\N
278	Vog3jPigUZLWQG5J24SPMVxCY4mVeqA	1	Disease Name: Malnutrition Case above 5 male	data	[]	bPljCnv89cKAC2lM5KJ84hBYILxId9d	R9LUB5mvxCO.FRzeEpefSK8	f6jAvfFgWBI42EJUcSyfZNQSmlFaVbg	aggregate	IDSR Malnutrition Case, > 5, ME						f			\N	f		INTEGER_ZERO_OR_POSITIVE	Malnutrition Case > 5 ME	R9LUB5mvxCO	FRzeEpefSK8				\N	\N	\N
279	f6jAvfFgWBI42EJUcSyfZNQSmlFaVbg	1	Disease Name: Malnutrition Case above 5 female	data	[]	Vog3jPigUZLWQG5J24SPMVxCY4mVeqA	R9LUB5mvxCO.q3GdT7f6iw9	tugXwRB7peGQvpFaVOkX75qtH1rQdeP	aggregate	IDSR Malnutrition Case, > 5, KE						f			\N	f		INTEGER_ZERO_OR_POSITIVE	Malnutrition Case > 5 KE	R9LUB5mvxCO	q3GdT7f6iw9				\N	\N	\N
281	GiHXQEk2Saxt9R1UW9QOf0ndR09u7gX	1	Disease Name: Malnutrition Death above 5 female	data	[]	tugXwRB7peGQvpFaVOkX75qtH1rQdeP	R9LUB5mvxCO.Q8U3fXSfxY8	OmqnKAPbmJ9wwftSCasLr5vBzmEHfyD	aggregate	IDSR Malnutrition Death , > 5, KE						f			\N	f		INTEGER_ZERO_OR_POSITIVE	Malnutrition Death > 5 KE	R9LUB5mvxCO	Q8U3fXSfxY8				\N	\N	\N
282	OmqnKAPbmJ9wwftSCasLr5vBzmEHfyD	1	Disease Name: Malnutrition Report for Year	period	[]	GiHXQEk2Saxt9R1UW9QOf0ndR09u7gX		T9HMRPmOE5o9pHMyxsLAETzIx55WArG						3		f			\N	t	1								\N	\N	\N
283	BeMuQcZMeVoyxcaVoLfjvG9B3VVCt8Q	1	Disease Name: Onchocerciasis Case under 5 male	data	[]	Ll77OPIYo1N9Xu9SrdprVcueYivRVBG	J2QRKPggvRC.AttDwO4xCIu	PfB8mkwgAzPpwPYwmYRvEfl9f0eZ11v	aggregate	IDSR Onchocerciasis Case, < 5, ME						f			\N	f		INTEGER_ZERO_OR_POSITIVE	Onchocerciasis Case < 5 ME	J2QRKPggvRC	AttDwO4xCIu				\N	\N	\N
284	PfB8mkwgAzPpwPYwmYRvEfl9f0eZ11v	1	Disease Name: Onchocerciasis Case under 5 female	data	[]	BeMuQcZMeVoyxcaVoLfjvG9B3VVCt8Q	J2QRKPggvRC.QInmZugn9JO	w4bK8AEAYvhnrZpvxz6d3t7aKhgtRSA	aggregate	IDSR Onchocerciasis Case, < 5, KE						f			\N	f		INTEGER_ZERO_OR_POSITIVE	Onchocerciasis Case < 5 KE	J2QRKPggvRC	QInmZugn9JO				\N	\N	\N
285	w4bK8AEAYvhnrZpvxz6d3t7aKhgtRSA	1	Disease Name: Onchocerciasis Death under 5 male	data	[]	PfB8mkwgAzPpwPYwmYRvEfl9f0eZ11v	J2QRKPggvRC.LZsl9VW71qr	4RpRpp77nTKqyQWxqEqpaVbr24BV1kg	aggregate	IDSR Onchocerciasis Death , < 5, ME						f			\N	f		INTEGER_ZERO_OR_POSITIVE	Onchocerciasis Death < 5 ME	J2QRKPggvRC	LZsl9VW71qr				\N	\N	\N
286	4RpRpp77nTKqyQWxqEqpaVbr24BV1kg	1	Disease Name: Onchocerciasis Death under 5 female	data	[]	w4bK8AEAYvhnrZpvxz6d3t7aKhgtRSA	J2QRKPggvRC.ifRTBcyGzHU	r60G4w7SIvzSuVDz6jpr4h1OjkQtJeR	aggregate	IDSR Onchocerciasis Death , < 5, KE						f			\N	f		INTEGER_ZERO_OR_POSITIVE	Onchocerciasis Death < 5 KE	J2QRKPggvRC	ifRTBcyGzHU				\N	\N	\N
287	r60G4w7SIvzSuVDz6jpr4h1OjkQtJeR	1	Disease Name: Onchocerciasis Case above 5 male	data	[]	4RpRpp77nTKqyQWxqEqpaVbr24BV1kg	J2QRKPggvRC.FRzeEpefSK8	gzUky9MkN0LLKdWqAu6aOJTPz4ZbJhV	aggregate	IDSR Onchocerciasis Case, > 5, ME						f			\N	f		INTEGER_ZERO_OR_POSITIVE	Onchocerciasis Case > 5 ME	J2QRKPggvRC	FRzeEpefSK8				\N	\N	\N
288	gzUky9MkN0LLKdWqAu6aOJTPz4ZbJhV	1	Disease Name: Onchocerciasis Case above 5 female	data	[]	r60G4w7SIvzSuVDz6jpr4h1OjkQtJeR	J2QRKPggvRC.q3GdT7f6iw9	N7WXVYLqLfcEgfFOwkJdzj9qhGsXBry	aggregate	IDSR Onchocerciasis Case, > 5, KE						f			\N	f		INTEGER_ZERO_OR_POSITIVE	Onchocerciasis Case > 5 KE	J2QRKPggvRC	q3GdT7f6iw9				\N	\N	\N
289	N7WXVYLqLfcEgfFOwkJdzj9qhGsXBry	1	Disease Name: Onchocerciasis Death above 5 male	data	[]	gzUky9MkN0LLKdWqAu6aOJTPz4ZbJhV	J2QRKPggvRC.lW9u3eKdMXH	89fA9x9frSNBXK7jTOv7NN9Gr14X0h0	aggregate	IDSR Onchocerciasis Death , > 5, ME						f			\N	f		INTEGER_ZERO_OR_POSITIVE	Onchocerciasis Death > 5 ME	J2QRKPggvRC	lW9u3eKdMXH				\N	\N	\N
290	89fA9x9frSNBXK7jTOv7NN9Gr14X0h0	1	Disease Name: Onchocerciasis Death above 5 female	data	[]	N7WXVYLqLfcEgfFOwkJdzj9qhGsXBry	J2QRKPggvRC.Q8U3fXSfxY8	6hv1KFRitmTizdOEnvxTxt9sCyu2q0D	aggregate	IDSR Onchocerciasis Death , > 5, KE						f			\N	f		INTEGER_ZERO_OR_POSITIVE	Onchocerciasis Death > 5 KE	J2QRKPggvRC	Q8U3fXSfxY8				\N	\N	\N
291	6hv1KFRitmTizdOEnvxTxt9sCyu2q0D	1	Disease Name:  Onchocerciasis \nReport for Year	period	[]	89fA9x9frSNBXK7jTOv7NN9Gr14X0h0		r1k5AErY7j50rU9ymXhyc0P3hVkghvo						3		f			\N	t	1								\N	\N	\N
292	NKEshpLwsi0GFln5KI3wD9wmDjaffcA	1	Disease Name: Pneumonia Case under 5 male	data	[]	Ll77OPIYo1N9Xu9SrdprVcueYivRVBG	qXCZieHvyrA.AttDwO4xCIu	tRkGknZf65lJh6LvQc7iabR6vEqMpdi	aggregate	IDSR Pneumonia <5 Years Case, < 5, ME						f			\N	f		INTEGER_ZERO_OR_POSITIVE	Pneumonia Case < 5 ME	qXCZieHvyrA	AttDwO4xCIu				\N	\N	\N
293	tRkGknZf65lJh6LvQc7iabR6vEqMpdi	1	Disease Name: Pneumonia Case under 5 female	data	[]	NKEshpLwsi0GFln5KI3wD9wmDjaffcA	qXCZieHvyrA.QInmZugn9JO	tjmbkchXOM91kBUA0jhOP5NHgubEo9w	aggregate	IDSR Pneumonia <5 Years Case, < 5, KE						f			\N	f		INTEGER_ZERO_OR_POSITIVE	Pneumonia Case < 5 KE	qXCZieHvyrA	QInmZugn9JO				\N	\N	\N
294	tjmbkchXOM91kBUA0jhOP5NHgubEo9w	1	Disease Name: Pneumonia Death under 5 male	data	[]	tRkGknZf65lJh6LvQc7iabR6vEqMpdi	qXCZieHvyrA.LZsl9VW71qr	yhYQqnac6GthJRP0PqxqOtc8jwldCWZ	aggregate	IDSR Pneumonia <5 Years Death , < 5, ME						f			\N	f		INTEGER_ZERO_OR_POSITIVE	Pneumonia Death < 5 ME	qXCZieHvyrA	LZsl9VW71qr				\N	\N	\N
295	yhYQqnac6GthJRP0PqxqOtc8jwldCWZ	1	Disease Name: Pneumonia Death under 5 female	data	[]	tjmbkchXOM91kBUA0jhOP5NHgubEo9w	qXCZieHvyrA.ifRTBcyGzHU	8HERzuS5xJmKHCdGSUkapgEp3sLzvlJ	aggregate	IDSR Pneumonia <5 Years Death , < 5, KE						f			\N	f		INTEGER_ZERO_OR_POSITIVE	Pneumonia Death < 5 KE	qXCZieHvyrA	ifRTBcyGzHU				\N	\N	\N
296	8HERzuS5xJmKHCdGSUkapgEp3sLzvlJ	1	Disease Name: Pneumonia \nReport for Year	period	[]	yhYQqnac6GthJRP0PqxqOtc8jwldCWZ		aWuuaXmS8HjvPQa2u4jDNI7cM94OLuB						3		f			\N	t	1								\N	\N	\N
297	DhUG0hVrUbQa2usfoqHbww9XzqzqDPF	1	Disease Name: Tick Borne Relapsing fever Case under 5 male	data	[]	Ll77OPIYo1N9Xu9SrdprVcueYivRVBG	RBLOayRFCwZ.AttDwO4xCIu	dU2w9C6TbSNzsjJd3KmGaNbwZM3NXo7	aggregate	IDSR Tick Borne Relapsing fever Case, < 5, ME						f			\N	f		INTEGER_ZERO_OR_POSITIVE	TBP Fever Case < 5 ME	RBLOayRFCwZ	AttDwO4xCIu				\N	\N	\N
298	dU2w9C6TbSNzsjJd3KmGaNbwZM3NXo7	1	Disease Name: Tick Borne Relapsing fever Case under 5 female	data	[]	DhUG0hVrUbQa2usfoqHbww9XzqzqDPF	RBLOayRFCwZ.QInmZugn9JO	ZOhMPkG5qn58RPaxdY9816gsTesaAzt	aggregate	IDSR Tick Borne Relapsing fever Case, < 5, KE						f			\N	f		INTEGER_ZERO_OR_POSITIVE	TBP Fever Case < 5 KE	RBLOayRFCwZ	QInmZugn9JO				\N	\N	\N
299	ZOhMPkG5qn58RPaxdY9816gsTesaAzt	1	Disease Name: Tick Borne Relapsing fever Death under 5 male	data	[]	dU2w9C6TbSNzsjJd3KmGaNbwZM3NXo7	RBLOayRFCwZ.LZsl9VW71qr	MNFiBv9yEKKNIiywqdjHAHkngPq0Dcc	aggregate	IDSR Tick Borne Relapsing fever Death , < 5, ME						f			\N	f		INTEGER_ZERO_OR_POSITIVE	TBP Fever Death < 5 ME	RBLOayRFCwZ	LZsl9VW71qr				\N	\N	\N
300	MNFiBv9yEKKNIiywqdjHAHkngPq0Dcc	1	Disease Name: Tick Borne Relapsing fever Death under 5 female	data	[]	ZOhMPkG5qn58RPaxdY9816gsTesaAzt	RBLOayRFCwZ.ifRTBcyGzHU	yA26tqOVn8rkTb3bQomklIXBOSFVrkq	aggregate	IDSR Tick Borne Relapsing fever Death , < 5, KE						f			\N	f		INTEGER_ZERO_OR_POSITIVE	TBP Fever Death < 5 KE	RBLOayRFCwZ	ifRTBcyGzHU				\N	\N	\N
301	yA26tqOVn8rkTb3bQomklIXBOSFVrkq	1	Disease Name: Tick Borne Relapsing fever Case above 5 male	data	[]	MNFiBv9yEKKNIiywqdjHAHkngPq0Dcc	RBLOayRFCwZ.FRzeEpefSK8	BFOoixFvjcFw2QMAWvAcIzOiKP4lnGT	aggregate	IDSR Tick Borne Relapsing fever Case, > 5, ME						f			\N	f		INTEGER_ZERO_OR_POSITIVE	TBP Fever Case > 5 ME	RBLOayRFCwZ	FRzeEpefSK8				\N	\N	\N
302	BFOoixFvjcFw2QMAWvAcIzOiKP4lnGT	1	Disease Name: Tick Borne Relapsing fever Case above 5 female	data	[]	yA26tqOVn8rkTb3bQomklIXBOSFVrkq	RBLOayRFCwZ.q3GdT7f6iw9	Wt0sIHGyzH1Fa25h1ejH99Tiarh1mzW	aggregate	IDSR Tick Borne Relapsing fever Case, > 5, KE						f			\N	f		INTEGER_ZERO_OR_POSITIVE	TBP Fever Case > 5 KE	RBLOayRFCwZ	q3GdT7f6iw9				\N	\N	\N
303	Wt0sIHGyzH1Fa25h1ejH99Tiarh1mzW	1	Disease Name: Tick Borne Relapsing fever Death above 5 male	data	[]	BFOoixFvjcFw2QMAWvAcIzOiKP4lnGT	RBLOayRFCwZ.lW9u3eKdMXH	VaDo89wWFRAyxnHLw6g4RT8tOGkHdX9	aggregate	IDSR Tick Borne Relapsing fever Death , > 5, ME						f			\N	f		INTEGER_ZERO_OR_POSITIVE	TBP Fever Death > 5 ME	RBLOayRFCwZ	lW9u3eKdMXH				\N	\N	\N
304	VaDo89wWFRAyxnHLw6g4RT8tOGkHdX9	1	Disease Name: Tick Borne Relapsing fever Death above 5 female	data	[]	Wt0sIHGyzH1Fa25h1ejH99Tiarh1mzW	RBLOayRFCwZ.Q8U3fXSfxY8	thkVhwLnArW4Ggn12FN3eZOChMoG4yA	aggregate	IDSR Tick Borne Relapsing fever Death , > 5, KE						f			\N	f		INTEGER_ZERO_OR_POSITIVE	TBP Fever Death > 5 KE	RBLOayRFCwZ	Q8U3fXSfxY8				\N	\N	\N
305	thkVhwLnArW4Ggn12FN3eZOChMoG4yA	1	Disease Name: Tick Borne Relapsing Fever\nReport for Year	period	[]	VaDo89wWFRAyxnHLw6g4RT8tOGkHdX9		Ku6zna0yDCuSPOqeFU5JAN3QKCKr5qb						3		f			\N	t	1								\N	\N	\N
306	aGdul9kpBDup8dXDoeEkCXHAKTPC9UU	1	Disease Name: Trachoma Case under 5 male	data	[]	Ll77OPIYo1N9Xu9SrdprVcueYivRVBG	iBPKR7zootI.AttDwO4xCIu	yoRyGcpMJpt01NagkPrSGcrje3lPK9a	aggregate	IDSR Trachoma Case, < 5, ME						f			\N	f		INTEGER_ZERO_OR_POSITIVE	Trachoma Case < 5 ME	iBPKR7zootI	AttDwO4xCIu				\N	\N	\N
307	yoRyGcpMJpt01NagkPrSGcrje3lPK9a	1	Disease Name: Trachoma Case under 5 female	data	[]	aGdul9kpBDup8dXDoeEkCXHAKTPC9UU	iBPKR7zootI.QInmZugn9JO	WaGuMuwsf3oVA8SJNx8PTpb7D0j8mYV	aggregate	IDSR Trachoma Case, < 5, KE						f			\N	f		INTEGER_ZERO_OR_POSITIVE	Trachoma Case < 5 KE	iBPKR7zootI	QInmZugn9JO				\N	\N	\N
308	WaGuMuwsf3oVA8SJNx8PTpb7D0j8mYV	1	Disease Name: Trachoma Death under 5 male	data	[]	yoRyGcpMJpt01NagkPrSGcrje3lPK9a	iBPKR7zootI.LZsl9VW71qr	xK9NFtGZl7DHRVXqzmvGWEwunI67nqZ	aggregate	IDSR Trachoma Death , < 5, ME						f			\N	f		INTEGER_ZERO_OR_POSITIVE	Trachoma Death < 5 ME	iBPKR7zootI	LZsl9VW71qr				\N	\N	\N
309	xK9NFtGZl7DHRVXqzmvGWEwunI67nqZ	1	Disease Name: Trachoma Death under 5 female	data	[]	WaGuMuwsf3oVA8SJNx8PTpb7D0j8mYV	iBPKR7zootI.ifRTBcyGzHU	DG8foqMsMi13Nx5cb6yG4Kxr9vKe0ph	aggregate	IDSR Trachoma Death , < 5, KE						f			\N	f		INTEGER_ZERO_OR_POSITIVE	Trachoma Death < 5 KE	iBPKR7zootI	ifRTBcyGzHU				\N	\N	\N
310	DG8foqMsMi13Nx5cb6yG4Kxr9vKe0ph	1	Disease Name: Trachoma Case above 5 male	data	[]	xK9NFtGZl7DHRVXqzmvGWEwunI67nqZ	iBPKR7zootI.FRzeEpefSK8	yCsZsrOaWSFKMgKLoePqMi636BUCmcG	aggregate	IDSR Trachoma Case, > 5, ME						f			\N	f		INTEGER_ZERO_OR_POSITIVE	Trachoma Case > 5 ME	iBPKR7zootI	FRzeEpefSK8				\N	\N	\N
311	yCsZsrOaWSFKMgKLoePqMi636BUCmcG	1	Disease Name: Trachoma Case above 5 female	data	[]	DG8foqMsMi13Nx5cb6yG4Kxr9vKe0ph	iBPKR7zootI.q3GdT7f6iw9	xjigSuDdf1wMbUdN3K1dlhMJxCQz3TY	aggregate	IDSR Trachoma Case, > 5, KE						f			\N	f		INTEGER_ZERO_OR_POSITIVE	Trachoma Case > 5 KE	iBPKR7zootI	q3GdT7f6iw9				\N	\N	\N
312	xjigSuDdf1wMbUdN3K1dlhMJxCQz3TY	1	Disease Name: Trachoma Death above 5 male	data	[]	yCsZsrOaWSFKMgKLoePqMi636BUCmcG	iBPKR7zootI.lW9u3eKdMXH	u5wj6RPn9z5DwQUxxDjytLm8olJgYuh	aggregate	IDSR Trachoma Death , > 5, ME						f			\N	f		INTEGER_ZERO_OR_POSITIVE	Trachoma Death > 5 ME	iBPKR7zootI	lW9u3eKdMXH				\N	\N	\N
313	u5wj6RPn9z5DwQUxxDjytLm8olJgYuh	1	Disease Name: Trachoma Death  above 5 female	data	[]	xjigSuDdf1wMbUdN3K1dlhMJxCQz3TY	iBPKR7zootI.Q8U3fXSfxY8	2WvTLiRgxwpvNkN6VqP5MB0dje6OIpH	aggregate	IDSR Trachoma Death , > 5, KE						f			\N	f		INTEGER_ZERO_OR_POSITIVE	Trachoma Death > 5 KE	iBPKR7zootI	Q8U3fXSfxY8				\N	\N	\N
314	2WvTLiRgxwpvNkN6VqP5MB0dje6OIpH	1	Disease Name: Trachoma\nReport for Year	period	[]	u5wj6RPn9z5DwQUxxDjytLm8olJgYuh		JW2mYKIV1pKQFnxRSqQuaWlsjbw82wc						3		f			\N	t	1								\N	\N	\N
315	alhfdsoBTAmaWT67xrIgrlh7sJLfUvv	1	Disease Name: Trypanosomiasis Case under 5 male	data	[]	Ll77OPIYo1N9Xu9SrdprVcueYivRVBG	r9TEXVjoUun.AttDwO4xCIu	DvqwcJhwKRpZ95ozFwuInD7HuGNa1no	aggregate	IDSR Trypanosomiasis Case, < 5, ME						f			\N	f		INTEGER_ZERO_OR_POSITIVE	Trypanosomiasis Case < 5 ME	r9TEXVjoUun	AttDwO4xCIu				\N	\N	\N
316	DvqwcJhwKRpZ95ozFwuInD7HuGNa1no	1	Disease Name: Trypanosomiasis Case under 5 female	data	[]	alhfdsoBTAmaWT67xrIgrlh7sJLfUvv	r9TEXVjoUun.QInmZugn9JO	BmapJX4xBT34paOdr9Uo2Inq4aAwRps	aggregate	IDSR Trypanosomiasis Case, < 5, KE						f			\N	f		INTEGER_ZERO_OR_POSITIVE	Trypanosomiasis Case < 5 KE	r9TEXVjoUun	QInmZugn9JO				\N	\N	\N
317	BmapJX4xBT34paOdr9Uo2Inq4aAwRps	1	Disease Name: Trypanosomiasis Death under 5 male	data	[]	DvqwcJhwKRpZ95ozFwuInD7HuGNa1no	r9TEXVjoUun.LZsl9VW71qr	YIaw3KpzSTrTV8KCOsSWxQtnTOrOqsD	aggregate	IDSR Trypanosomiasis Death , < 5, ME						f			\N	f		INTEGER_ZERO_OR_POSITIVE	Trypanosomiasis Death < 5 ME	r9TEXVjoUun	LZsl9VW71qr				\N	\N	\N
318	YIaw3KpzSTrTV8KCOsSWxQtnTOrOqsD	1	Disease Name: Trypanosomiasis Death under 5 female	data	[]	BmapJX4xBT34paOdr9Uo2Inq4aAwRps	r9TEXVjoUun.ifRTBcyGzHU	sDH1YfNbe0MN9QoiY7GT7FJw3dN7d2W	aggregate	IDSR Trypanosomiasis Death , < 5, KE						f			\N	f		INTEGER_ZERO_OR_POSITIVE	Trypanosomiasis Death < 5 KE	r9TEXVjoUun	ifRTBcyGzHU				\N	\N	\N
319	sDH1YfNbe0MN9QoiY7GT7FJw3dN7d2W	1	Disease Name: Trypanosomiasis Case above 5 male	data	[]	YIaw3KpzSTrTV8KCOsSWxQtnTOrOqsD	r9TEXVjoUun.FRzeEpefSK8	qZt5QfEanuhhWTrAdTnxotmHXbZ0ILc	aggregate	IDSR Trypanosomiasis Case, > 5, ME						f			\N	f		INTEGER_ZERO_OR_POSITIVE	Trypanosomiasis Case > 5 ME	r9TEXVjoUun	FRzeEpefSK8				\N	\N	\N
320	qZt5QfEanuhhWTrAdTnxotmHXbZ0ILc	1	Disease Name: Trypanosomiasis Case above 5 female	data	[]	sDH1YfNbe0MN9QoiY7GT7FJw3dN7d2W	r9TEXVjoUun.q3GdT7f6iw9	TiD7te7X46b3zfmLQFhwlcNEQsHeMzd	aggregate	IDSR Trypanosomiasis Case, > 5, KE						f			\N	f		INTEGER_ZERO_OR_POSITIVE	Trypanosomiasis Case > 5 KE	r9TEXVjoUun	q3GdT7f6iw9				\N	\N	\N
321	TiD7te7X46b3zfmLQFhwlcNEQsHeMzd	1	Disease Name: Trypanosomiasis Death above 5 male	data	[]	qZt5QfEanuhhWTrAdTnxotmHXbZ0ILc	r9TEXVjoUun.lW9u3eKdMXH	fy8C0RLxkO0ZsksRXsYkloPGHrbGM7c	aggregate	IDSR Trypanosomiasis Death , > 5, ME						f			\N	f		INTEGER_ZERO_OR_POSITIVE	Trypanosomiasis Death > 5 ME	r9TEXVjoUun	lW9u3eKdMXH				\N	\N	\N
322	fy8C0RLxkO0ZsksRXsYkloPGHrbGM7c	1	Disease Name: Trypanosomiasis Death above 5 female	data	[]	TiD7te7X46b3zfmLQFhwlcNEQsHeMzd	r9TEXVjoUun.Q8U3fXSfxY8	jFt9BqjOtZOPNWOiRCcO5KaSe8lKbRa	aggregate	IDSR Trypanosomiasis Death , > 5, KE						f			\N	f		INTEGER_ZERO_OR_POSITIVE	Trypanosomiasis Death > 5 KE	r9TEXVjoUun	Q8U3fXSfxY8				\N	\N	\N
323	jFt9BqjOtZOPNWOiRCcO5KaSe8lKbRa	1	Disease Name: Trypanosomiasis\nReport for Year	period	[]	fy8C0RLxkO0ZsksRXsYkloPGHrbGM7c		nthmwfhPOH6SO5Vr7Ixf7vLDAbtOaF1						3		f			\N	t	1								\N	\N	\N
324	C51PbFkxhojEEPiCoRr9i3vSRsLhu84	1	DIsease Name: Typhiod Case under 5 male	data	[]	Ll77OPIYo1N9Xu9SrdprVcueYivRVBG	OOnL47t1Ltg.AttDwO4xCIu	uh8UtQZdxXHY2r6nOvjUCfl2P9tx2cI	aggregate	IDSR Typhiod Case, < 5, ME						f			\N	f		INTEGER_ZERO_OR_POSITIVE	Typhiod Case < 5 ME	OOnL47t1Ltg	AttDwO4xCIu				\N	\N	\N
325	uh8UtQZdxXHY2r6nOvjUCfl2P9tx2cI	1	Disease Name: Typhiod Case under 5 female	data	[]	C51PbFkxhojEEPiCoRr9i3vSRsLhu84	OOnL47t1Ltg.QInmZugn9JO	CHLRA5yfvwRCzqpvU4td1bRud42wrSP	aggregate	IDSR Typhiod Case, < 5, KE						f			\N	f		INTEGER_ZERO_OR_POSITIVE	Typhiod Case < 5 KE	OOnL47t1Ltg	QInmZugn9JO				\N	\N	\N
326	CHLRA5yfvwRCzqpvU4td1bRud42wrSP	1	Disease Name: Typhiod Death under 5 male	data	[]	uh8UtQZdxXHY2r6nOvjUCfl2P9tx2cI	OOnL47t1Ltg.LZsl9VW71qr	XDhFy3n4cD0TRb1dK1g6Md98X1azVSB	aggregate	IDSR Typhiod Death , < 5, ME						f			\N	f		INTEGER_ZERO_OR_POSITIVE	Typhiod Death < 5 ME	OOnL47t1Ltg	LZsl9VW71qr				\N	\N	\N
327	XDhFy3n4cD0TRb1dK1g6Md98X1azVSB	1	Disease Name: Typhiod Death under 5 female	data	[]	CHLRA5yfvwRCzqpvU4td1bRud42wrSP	OOnL47t1Ltg.ifRTBcyGzHU	wxlRqCvP9q3269cweG3XynR0DElNgch	aggregate	IDSR Typhiod Death , < 5, KE						f			\N	f		INTEGER_ZERO_OR_POSITIVE	Typhiod Death < 5 KE	OOnL47t1Ltg	ifRTBcyGzHU				\N	\N	\N
328	wxlRqCvP9q3269cweG3XynR0DElNgch	1	Disease Name: Typhiod Case above 5 male	data	[]	XDhFy3n4cD0TRb1dK1g6Md98X1azVSB	OOnL47t1Ltg.FRzeEpefSK8	sCcVjPRF6JD2r1kEJJK55MEzBKzWhgZ	aggregate	IDSR Typhiod Case, > 5, ME						f			\N	f		INTEGER_ZERO_OR_POSITIVE	Typhiod Case > 5 ME	OOnL47t1Ltg	FRzeEpefSK8				\N	\N	\N
329	sCcVjPRF6JD2r1kEJJK55MEzBKzWhgZ	1	Disease Name: Typhiod Case above 5 female	data	[]	wxlRqCvP9q3269cweG3XynR0DElNgch	OOnL47t1Ltg.q3GdT7f6iw9	lgYI0A5btHrcjxNtTosEPZLHe7mEOBD	aggregate	IDSR Typhiod Case, > 5, KE						f			\N	f		INTEGER_ZERO_OR_POSITIVE	Typhiod Case > 5 KE	OOnL47t1Ltg	q3GdT7f6iw9				\N	\N	\N
330	lgYI0A5btHrcjxNtTosEPZLHe7mEOBD	1	Disease Name: Typhiod Death above 5 male	data	[]	sCcVjPRF6JD2r1kEJJK55MEzBKzWhgZ	OOnL47t1Ltg.lW9u3eKdMXH	dSgNhmrRI4Fr8mJ4EfUOedviTl5S6AB	aggregate	IDSR Typhiod Death , > 5, ME						f			\N	f		INTEGER_ZERO_OR_POSITIVE	Typhiod Death > 5 ME	OOnL47t1Ltg	lW9u3eKdMXH				\N	\N	\N
331	dSgNhmrRI4Fr8mJ4EfUOedviTl5S6AB	1	Disease Name: Typhiod Death above 5 female	data	[]	lgYI0A5btHrcjxNtTosEPZLHe7mEOBD	OOnL47t1Ltg.Q8U3fXSfxY8	uNinzEeeRnrBWq7tRIhQDKrnq9AyaVB	aggregate	IDSR Typhiod Death , > 5, KE						f			\N	f		INTEGER_ZERO_OR_POSITIVE	Typhiod Death > 5 KE	OOnL47t1Ltg	Q8U3fXSfxY8				\N	\N	\N
332	uNinzEeeRnrBWq7tRIhQDKrnq9AyaVB	1	Disease Name: Typhiod \nReport for Year	period	[]	dSgNhmrRI4Fr8mJ4EfUOedviTl5S6AB		ktUHNpFLUPeTlTTtAc2btaWmrOCpXLI						3		f			\N	t	1								\N	\N	\N
333	1fuXjQQKdLMbxJHUennDQ2Samop7Wfv	1	Enter Epidemiological Week Number	period	[]	peKiGAl2jiM3yglJ8CduJlUHRkbIr4C		Z7CE40PvAI3deKBSmmUf78mHO3H520O				You have entered wrong week number more than three times	You have entered wrong week number please try again	3		f		Weekly	52	f									\N	\N	\N
334	2TYvckK2fnTQwz0k0p7BjAecUBpnkqU	1	You are about to submit data, are you sure?	data-submission	[{"id":"tPSGwNQXN6FwYuRdQq1u4VFk3s5KvOd","title":"Yes","response":true},{"id":"Qnl2VFzZBHyafjQwpPvhSjTKFbl59FX","title":"No","response":false}]	oiRzg1QMuvp8rCRApPIXObJUEw4VRR9		64w81ibFCofqOVsyNxZMKXeITnlnzjc								t			\N	f									\N	\N	\N
335	64w81ibFCofqOVsyNxZMKXeITnlnzjc	1	Thanks data captured and saved	message	[]	2TYvckK2fnTQwz0k0p7BjAecUBpnkqU										f			\N	f									\N	\N	\N
336	p8TtKZ6z3j79wFngOTwoaIaLUlFPv5C	1	You are about to submit data, are you sure?	data-submission	[]	rm3972uwPuULs7mQ8LCtVCWe0QNejy6		uCaPZDYBZVeNRc0KYB2ysXahULhOPJR								t			\N	f									\N	\N	\N
337	uCaPZDYBZVeNRc0KYB2ysXahULhOPJR	1	Thanks, data captured and saved	message	[]	p8TtKZ6z3j79wFngOTwoaIaLUlFPv5C										f			\N	f									\N	\N	\N
338	ghIkgNJC0FsrGJfpuUa2PfCoFBCrIHU	1	You are about to submit data, are you sure?	data-submission	[]	mnuIXHpp1CJqLYgnLsz2NnD7jSpqrO9		WOWS8vF1vkAbZKAbnnFFmt4yTzPDYyo								t			\N	f									\N	\N	\N
339	WOWS8vF1vkAbZKAbnnFFmt4yTzPDYyo	1	Thanks, data captured and saved	message	[]	ghIkgNJC0FsrGJfpuUa2PfCoFBCrIHU										f			\N	f									\N	\N	\N
340	HAopKCo7DhtssaFHVyLHoYTf41PMhKb	1	You are about to submit data, are you sure?	data-submission	[]	zGM7j5Vp6cYzjjyuklgvi6wCsmK7nF0		D3YPLWIAzc0VZ9Ua2IEo0ufUIIhUdnD								t			\N	f									\N	\N	\N
341	D3YPLWIAzc0VZ9Ua2IEo0ufUIIhUdnD	1	Thanks, data captured and saved 	message	[]	HAopKCo7DhtssaFHVyLHoYTf41PMhKb										f			\N	f									\N	\N	\N
342	ePAMb9OVPSsPFqw15cbr76HoQ9WalTp	1	You are about to submit data, are you sure?	data-submission	[]	FWSBvNnHuSvEKJx4UWdQFvS3Q6hkyOV		HuB2I9CQYEXtKArF12Q3XKkld61njb7								t			\N	f									\N	\N	\N
343	HuB2I9CQYEXtKArF12Q3XKkld61njb7	1	Thanks, data captured and saved	message	[]	ePAMb9OVPSsPFqw15cbr76HoQ9WalTp										f			\N	f									\N	\N	\N
344	T9HMRPmOE5o9pHMyxsLAETzIx55WArG	1	You are about to submit data, are you sure?	data-submission	[]	OmqnKAPbmJ9wwftSCasLr5vBzmEHfyD		dcy0rHffmPpSFJ0wZQd8GohkxDdYcI0								t			\N	f									\N	\N	\N
345	dcy0rHffmPpSFJ0wZQd8GohkxDdYcI0	1	Thanks, data captured and saved	message	[]	T9HMRPmOE5o9pHMyxsLAETzIx55WArG										f			\N	f									\N	\N	\N
346	r1k5AErY7j50rU9ymXhyc0P3hVkghvo	1	You are about to submit data, are you sure?	data-submission	[]	6hv1KFRitmTizdOEnvxTxt9sCyu2q0D		buQcJ6QWqZLEskJD6JeuAqP5RkSwL0X								t			\N	f									\N	\N	\N
347	buQcJ6QWqZLEskJD6JeuAqP5RkSwL0X	1	Thanks, data captured and saved	message	[]	r1k5AErY7j50rU9ymXhyc0P3hVkghvo										f			\N	f									\N	\N	\N
348	aWuuaXmS8HjvPQa2u4jDNI7cM94OLuB	1	You are about to submit data, are you sure?	data-submission	[]	8HERzuS5xJmKHCdGSUkapgEp3sLzvlJ		cGN0fi2vOTQzVQR4mMY4RnZalvu8sxl								t			\N	f									\N	\N	\N
349	cGN0fi2vOTQzVQR4mMY4RnZalvu8sxl	1	Thanks, data captured and saved	message	[]	aWuuaXmS8HjvPQa2u4jDNI7cM94OLuB										f			\N	f									\N	\N	\N
350	Ku6zna0yDCuSPOqeFU5JAN3QKCKr5qb	1	You are about to submit data, are you sure?	data-submission	[]	thkVhwLnArW4Ggn12FN3eZOChMoG4yA		FKS3YjbyZpjGStDEzzjH34jdKVV8cUJ								t			\N	f									\N	\N	\N
351	FKS3YjbyZpjGStDEzzjH34jdKVV8cUJ	1	Thanks, data captured and saved	message	[]	Ku6zna0yDCuSPOqeFU5JAN3QKCKr5qb										f			\N	f									\N	\N	\N
352	JW2mYKIV1pKQFnxRSqQuaWlsjbw82wc	1	You are about to submit data, are you sure?	data-submission	[]	2WvTLiRgxwpvNkN6VqP5MB0dje6OIpH		mO5OwUhfuTGbJvTAH731Xm30zInIeuj								t			\N	f									\N	\N	\N
353	mO5OwUhfuTGbJvTAH731Xm30zInIeuj	1	Thanks, data captured and saved	message	[]	JW2mYKIV1pKQFnxRSqQuaWlsjbw82wc										f			\N	f									\N	\N	\N
354	nthmwfhPOH6SO5Vr7Ixf7vLDAbtOaF1	1	You are about to submit data, are you sure?	data-submission	[]	jFt9BqjOtZOPNWOiRCcO5KaSe8lKbRa		oaH1Gekk0EI2qce5uim423XwM5mj2gA								t			\N	f									\N	\N	\N
355	oaH1Gekk0EI2qce5uim423XwM5mj2gA	1	Thanks, data captured and saved	message	[]	nthmwfhPOH6SO5Vr7Ixf7vLDAbtOaF1										f			\N	f									\N	\N	\N
356	ktUHNpFLUPeTlTTtAc2btaWmrOCpXLI	1	You are about to submit data, are you sure?	data-submission	[]	uNinzEeeRnrBWq7tRIhQDKrnq9AyaVB		FLzgAFcKe4k5XK5XAVOFTgUHgcEh8ul								t			\N	f									\N	\N	\N
357	FLzgAFcKe4k5XK5XAVOFTgUHgcEh8ul	1	Thanks, data captured and saved	message	[]	ktUHNpFLUPeTlTTtAc2btaWmrOCpXLI										f			\N	f									\N	\N	\N
358	3ld7Kjx2Ns2h5U9uXa2im3qvz4n4guN	1	You are about to submit data, are you sure?	data-submission	[]	d1CSJya9Y6525UYo5ifGMEHrbKg4c8n		xj6dtVUYeIIUQnOt7FAjsXOTaxDV5oJ								t			\N	f									\N	\N	\N
359	xj6dtVUYeIIUQnOt7FAjsXOTaxDV5oJ	1	Thanks, data captured and saved	message	[]	3ld7Kjx2Ns2h5U9uXa2im3qvz4n4guN										f			\N	f									\N	\N	\N
360	Z7CE40PvAI3deKBSmmUf78mHO3H520O	1	Enter Year	period	[]	1fuXjQQKdLMbxJHUennDQ2Samop7Wfv		pYt6ab9bJRs8RSev0xwKkxBvgjm7Nv8						3		f			\N	t	1								\N	\N	\N
361	pYt6ab9bJRs8RSev0xwKkxBvgjm7Nv8	1	You are about to submit weekly data, are you sure?	data-submission	[]	Z7CE40PvAI3deKBSmmUf78mHO3H520O		JjQzmQvS6pxTQKxmk0fxV01HoyX3fZa								t			\N	f						NDcgQeGaJC9			\N	\N	\N
362	JjQzmQvS6pxTQKxmk0fxV01HoyX3fZa	1	Thanks, data captured and saved	message	[]	pYt6ab9bJRs8RSev0xwKkxBvgjm7Nv8										f			\N	f									\N	\N	\N
363	50VgnSKK9m7kAJ6HWrQ0OIgseiaxhor	1	Enter Patient Age - In years	data	[]		Swn04dN2EwP	tEBlZOPIZzrhznQ2EXKS9G1eflfA9xm	event	Age			Incorrect age in years			f			\N	f		NUMBER	Age	Swn04dN2EwP			pTbM44O1h0V	aSCZpTZXpHl	\N	\N	\N
364	tEBlZOPIZzrhznQ2EXKS9G1eflfA9xm	1	Enter Number of Past Pregnancies	data	[]	50VgnSKK9m7kAJ6HWrQ0OIgseiaxhor	hSnPGNV9XPE	f6mV3p0qUyEASDWsT06j9YNFQvAQxdw	event	IDSR Number of past pregnancies						f			\N	f		INTEGER_POSITIVE	Past Pregnancies	hSnPGNV9XPE			pTbM44O1h0V	aSCZpTZXpHl	\N	\N	\N
365	f6mV3p0qUyEASDWsT06j9YNFQvAQxdw	1	Enter Number of Past Deliveries	data	[]	tEBlZOPIZzrhznQ2EXKS9G1eflfA9xm	uCsdFihd3Gf	akObcnjJUgN9jU0S7ctG7CBe2gILstz	event	IDSR number of past deliveries						f			\N	f		INTEGER_ZERO_OR_POSITIVE	Past Deliveries	uCsdFihd3Gf			pTbM44O1h0V	aSCZpTZXpHl	\N	\N	\N
366	akObcnjJUgN9jU0S7ctG7CBe2gILstz	1	IDSR Cause of Maternal Death	data	[{"id":"rvP8jYVjBcC","title":"APH","response":"1","value":"APH"},{"id":"yyHwZVKH3mO","title":"Abortion","response":"2","value":"Abortion"},{"id":"CJgJJv9uRbV","title":"Anaemia","response":"3","value":"Anaemia"},{"id":"sMjh7p3TNjl","title":"Eclampsia","response":"4","value":"Eclampsia"},{"id":"bBbvHPATsVI","title":"HIV-AIDS","response":"5","value":"HIV-AIDS"},{"id":"rH1nhB7MW3a","title":"Malaria","response":"6","value":"Malaria"},{"id":"eEx5wwfS5r8","title":"Obstructed Labour","response":"7","value":"Obstructed Labour"},{"id":"rZJNNo9o3uV","title":"PPH","response":"8","value":"PPH"},{"id":"sOo2iC50dml","title":"Pulmonary Oedema","response":"9","value":"Pulmonary Oedema"},{"id":"zcFtQHUw7Ff","title":"Ruptured Uterus","response":"10","value":"Ruptured Uterus"}]	f6mV3p0qUyEASDWsT06j9YNFQvAQxdw	dzzCEHjjaOr	JEGQaZJCx6aCj0My6yEjEaGQK1j5jfT	event	IDSR Cause of Maternal Death						f			\N	f		TEXT	Cause of Maternal Death	dzzCEHjjaOr			pTbM44O1h0V	aSCZpTZXpHl	\N	\N	\N
367	JEGQaZJCx6aCj0My6yEjEaGQK1j5jfT	1	IDSR Place where death occured	data	[{"id":"ScN2Vz9mYtj","title":"En route to health facility","response":"1","value":"En route to health facility"},{"id":"CdpW4sLTz2H","title":"Health facility","response":"2","value":"Health facility"},{"id":"GlKH1fXb9Zl","title":"Household","response":"3","value":"Household"}]	akObcnjJUgN9jU0S7ctG7CBe2gILstz	zS4r31BPG6X	I0mRduPcBHXxvv8k879eFoR1ERhBzO8	event	IDSR Place where death occured						f			\N	f		TEXT	Place where death occured	zS4r31BPG6X			pTbM44O1h0V	aSCZpTZXpHl	\N	\N	\N
368	I0mRduPcBHXxvv8k879eFoR1ERhBzO8	1	You are about to submit data to eidsr system	data-submission	[]	JEGQaZJCx6aCj0My6yEjEaGQK1j5jfT		Jf1zn3fjyNXJ9RQBQsFTsnIDCS4WmoS								t			\N	f									\N	\N	\N
369	Jf1zn3fjyNXJ9RQBQsFTsnIDCS4WmoS	1	Thanks data has been saved	message	[]	I0mRduPcBHXxvv8k879eFoR1ERhBzO8										f			\N	f									\N	\N	\N
370	2Nc4MMF1jv6rcgUv7DMX8Xxu3Hr0nsM	1	IDSR Disease	data	[{"id":"TWBvtjAyB60","title":"Cerebral Spinal Meningitis","response":"1","value":"Cerebral Spinal Meningitis"},{"id":"UUAslEwtC7e","title":"Chikungunya","response":"2","value":"Chikungunya"},{"id":"RhglzwW0Stv","title":"Cholera ","response":"3","value":"A00.9-Cholera "},{"id":"eHXm8ZU8zEI","title":"Dengue","response":"4","value":"Dengue"},{"id":"TXfwTuaV1bc","title":"Ebola","response":"5","value":"Ebola"},{"id":"e4oD5L3E0B8","title":"Epidemic viral keratoconjuctivitis","response":"6","value":"Epidemic viral keratoconjuctivitis"}]	NVd4wtTY1i4sYAtMJzedU1EXfblkd2n	Of2oRqwosOB	3trXY4oQvq1vyupGZAi59GYBIzcg2a3	event	IDSR Disease						f			\N	f		TEXT	IDSR Disease	Of2oRqwosOB			Rt3ZfijCNSR	oIfXzXib4AE	\N	\N	\N
371	3trXY4oQvq1vyupGZAi59GYBIzcg2a3	1	Enter number of days since symptoms began	data	[]	2Nc4MMF1jv6rcgUv7DMX8Xxu3Hr0nsM	VhU1TQa5hJV	waMtLhQj4cObxuuh6FyRXstoSZYYUui	event	IDSR Number of days since symptoms						f			\N	f		INTEGER_POSITIVE	IDSR Days since symptoms	VhU1TQa5hJV			Rt3ZfijCNSR	oIfXzXib4AE	\N	\N	\N
372	waMtLhQj4cObxuuh6FyRXstoSZYYUui	1	Choose Patient age Type	data	[{"id":"gROcyTVfL8h","title":"Days","response":"1","value":"Days"},{"id":"H6aQQhisSuv","title":"Hours","response":"2","value":"Hours"},{"id":"vW2sozl2oPn","title":"Months","response":"3","value":"Months"},{"id":"zpdLUDfUUxt","title":"Years","response":"4","value":"Years"}]	3trXY4oQvq1vyupGZAi59GYBIzcg2a3	JJkV68Devly	8aSMb8v7jrJpktYEe6daMVpQk4oLYfA	event	Age Type						f			\N	f		TEXT	Age Type	JJkV68Devly			Rt3ZfijCNSR	oIfXzXib4AE	\N	\N	\N
373	8aSMb8v7jrJpktYEe6daMVpQk4oLYfA	1	Enter Patient Age	data	[]	waMtLhQj4cObxuuh6FyRXstoSZYYUui	wtS5qShG6FX	y33EsvG8I6Stx2wvKy40gghLM1t1t53	event	IDSR Patient Age						f			\N	f		INTEGER_POSITIVE	IDSR Patient Age	wtS5qShG6FX			Rt3ZfijCNSR	oIfXzXib4AE	\N	\N	\N
374	y33EsvG8I6Stx2wvKy40gghLM1t1t53	1	Choose Patient Gender	data	[{"id":"k9uPFST6kxm","title":"Female","response":"1","value":"Female"},{"id":"sHZeC3hmKwG","title":"Male","response":"2","value":"Male"}]	8aSMb8v7jrJpktYEe6daMVpQk4oLYfA	UjPZIq15xs1	fIx1r05T1YxDg6c9eZFUbQJn6mxRZpd	event	Jinsia						f			\N	f		TEXT	Jinsia	UjPZIq15xs1			Rt3ZfijCNSR	oIfXzXib4AE	\N	\N	\N
375	fIx1r05T1YxDg6c9eZFUbQJn6mxRZpd	1	Select Case definition	data	[{"id":"kK02ky0Z0pP","title":"Confirmed","response":"1","value":"Confirmed"},{"id":"AiiRMEPTuhr","title":"Probable","response":"2","value":"Probable"},{"id":"CVpB5Yveq0s","title":"Suspected","response":"3","value":"Suspected"}]	y33EsvG8I6Stx2wvKy40gghLM1t1t53	IfRo0jcAZpB	3q1J5XxB1UM1K7i9ia37tlDfpOd1W9Z	event	IDSR Case Definition						f			\N	f		TEXT	IDSR Case Definition	IfRo0jcAZpB			Rt3ZfijCNSR	oIfXzXib4AE	\N	\N	\N
376	3q1J5XxB1UM1K7i9ia37tlDfpOd1W9Z	1	Was patient Vaccinated?	data	[{"id":"P9QrlSg3iDa","title":"No","response":"1","value":"No"},{"id":"qzHmwhHj9Sc","title":"Not Applicable","response":"2","value":"false"},{"id":"stS1n3ZPr2I","title":"Yes","response":"3","value":"Yes"}]	fIx1r05T1YxDg6c9eZFUbQJn6mxRZpd	A5XfPG0F327	xtOia0ZBcd9mVXFXy9OPrUZf8XiNi32	event	IDSR Was patient Vaccinated						f			\N	f		TEXT	IDSR patient vaccinated	A5XfPG0F327			Rt3ZfijCNSR	oIfXzXib4AE	\N	\N	\N
377	xtOia0ZBcd9mVXFXy9OPrUZf8XiNi32	1	Was Lab specimen taken?	data	[{"id":"PVI90pjF4raCusSwVFS4PWuBas1l2cV","title":"Yes","response":"1","value":true},{"id":"01wlV7YI1vtgCzpuyXEnGZqQSWW9s5r","title":"No","response":"2","value":false}]	3q1J5XxB1UM1K7i9ia37tlDfpOd1W9Z	xL2l4FGfOiU	LXhdmap63kIWJIewYBpJi6NpoqptD9h	event	IDSR Was Lab specimen taken						f			\N	f		BOOLEAN	IDSR LabSpecimenTaken	xL2l4FGfOiU			Rt3ZfijCNSR	oIfXzXib4AE	\N	\N	\N
378	LXhdmap63kIWJIewYBpJi6NpoqptD9h	1	Where was specimen sent?	data	[{"id":"yGBNyTE3xsL","title":"Discarded","response":"1","value":"Discarded"},{"id":"Md8STGhrz8p","title":"District Lab","response":"2","value":"District Lab"},{"id":"NaADyB0u3XK","title":"National Lab","response":"3","value":"National Lab"},{"id":"YOPmcMcSc2D","title":"Regional Lab","response":"4","value":"Regional Lab"}]	xtOia0ZBcd9mVXFXy9OPrUZf8XiNi32	H8ZNJvNZaGK	7l5cy2AMmBd250RU8uSkw05EDA440le	event	IDSR Where was specimen sent						f			\N	f		TEXT	IDSR WhereSpecimenSent	H8ZNJvNZaGK			Rt3ZfijCNSR	oIfXzXib4AE	\N	\N	\N
379	7l5cy2AMmBd250RU8uSkw05EDA440le	1	Is the patient alive?	data	[{"id":"KiEJI6SexKf7m13Y8ARMsltjsT2QLBF","title":"Yes","response":"1","value":true},{"id":"17cN4m0DTzX2LlZq0vzVBsdNuLGgr2f","title":"No","response":"2","value":false}]	LXhdmap63kIWJIewYBpJi6NpoqptD9h	CP2jyL0meYd	XVCzwKGzjqvGhwFEw7abrRLPbCNb5WI	event	IDSR Is the patient alive						f			\N	f		BOOLEAN	IDSR is patient alive	CP2jyL0meYd			Rt3ZfijCNSR	oIfXzXib4AE	\N	\N	\N
380	XVCzwKGzjqvGhwFEw7abrRLPbCNb5WI	1	Patient status 	data	[{"id":"anvzMd7xobk","title":"Admitted","response":"1","value":"Admitted"},{"id":"stoRl0yUgwO","title":"Discharged","response":"2","value":"Discharged"},{"id":"cQwAovxLRbn","title":"OPD","response":"3","value":"OPD"}]	7l5cy2AMmBd250RU8uSkw05EDA440le	QSFMWHHU1pk	GgQLxyISky6nu1OQwVKgWDjPR3RM6BT	event	IDSR Patient status						f			\N	f		TEXT	IDSR Patient status	QSFMWHHU1pk			Rt3ZfijCNSR	oIfXzXib4AE	\N	\N	\N
381	GgQLxyISky6nu1OQwVKgWDjPR3RM6BT	1	Action Taken: Referred?	data	[{"id":"q2hCcJc43r1tPpeZ1Nw2JXjVI9SM3Yb","title":"Yes","response":"1","value":true},{"id":"EjgwNo33RX7IUtZKinNaGh57V0XeOzK","title":"No","response":"2","value":false}]	XVCzwKGzjqvGhwFEw7abrRLPbCNb5WI	H0BGXB6ZBA6	shp6XlTh7hIV2XFXnbmr5ObgdrbMubB	event	IDSR Action Taken: Referred?						f			\N	f		BOOLEAN	IDSR AT: Referred	H0BGXB6ZBA6			Rt3ZfijCNSR	oIfXzXib4AE	\N	\N	\N
382	shp6XlTh7hIV2XFXnbmr5ObgdrbMubB	1	Action Taken: Admitted?	data	[{"id":"l5es6rR7VjDilIPM63UQM0wmkMFsUJI","title":"Yes","response":"1","value":true},{"id":"dw0EreP6xrOsQu4uBPOCLNbYUZB6dzl","title":"No","response":"2","value":false}]	GgQLxyISky6nu1OQwVKgWDjPR3RM6BT	v6BYZIjbQ5l	srt4A0MqbhFN4DJjylxH9HkZBDzF8nm	event	IDSR Action Taken: Admitted?						f			\N	f		BOOLEAN	IDSR AT: Admitted?	v6BYZIjbQ5l			Rt3ZfijCNSR	oIfXzXib4AE	\N	\N	\N
383	srt4A0MqbhFN4DJjylxH9HkZBDzF8nm	1	Action Taken: Quarantine?	data	[{"id":"8AX2WJIkdMFhUhylY75oftCEhnQbd18","title":"Yes","response":"1","value":true},{"id":"LDYqO9tSbC94bfLxzSIozpeRMZvIlQ9","title":"No","response":"2","value":false}]	shp6XlTh7hIV2XFXnbmr5ObgdrbMubB	DvIvLGska4L	eVnTNe5v5mFmmwUXeUISiFJrnLEAPsz	event	IDSR Action Taken: Quarantine?						f			\N	f		BOOLEAN	IDSR AT: Quarantine	DvIvLGska4L			Rt3ZfijCNSR	oIfXzXib4AE	\N	\N	\N
384	eVnTNe5v5mFmmwUXeUISiFJrnLEAPsz	1	Action Taken: Investigation?	data	[{"id":"DjAMhz7ZIX9xmRCIBex2lLGJqa7BMWt","title":"Yes","response":"1","value":true},{"id":"KlDWdLYkOdEbHK3M4mi8JRijEyn2mWF","title":"No","response":"2","value":false}]	srt4A0MqbhFN4DJjylxH9HkZBDzF8nm	aBHgXkUZhBa	pK8qqwfrBi7uuea5kqVbMozOJ37LVJV	event	IDSR Action Taken: Investigation						f			\N	f		BOOLEAN	IDSR AT: Investigation	aBHgXkUZhBa			Rt3ZfijCNSR	oIfXzXib4AE	\N	\N	\N
385	pK8qqwfrBi7uuea5kqVbMozOJ37LVJV	1	Action Taken: Contact Tracing	data	[{"id":"pnD3ZpfhNvpRaIkC5jQCtRoUch3QgAN","title":"Yes","response":"1","value":true},{"id":"WiH4zRDh0wmdwrKEW95mWE6h79VlWbf","title":"No","response":"2","value":false}]	eVnTNe5v5mFmmwUXeUISiFJrnLEAPsz	x3bB0bwXUxf	gsgy6GrNAffxHmMglbjTSBW8utwyDqS	event	IDSR Action Taken: Contact Tracing						f			\N	f		BOOLEAN	IDSR AT: Cont tracing	x3bB0bwXUxf			Rt3ZfijCNSR	oIfXzXib4AE	\N	\N	\N
386	gsgy6GrNAffxHmMglbjTSBW8utwyDqS	1	You are about to submit data, are you sure?	data-submission	[]	pK8qqwfrBi7uuea5kqVbMozOJ37LVJV		hiR9ajkzB3BdbMx8u5xOAiIIfBy67GC								t			\N	f									\N	\N	\N
387	hiR9ajkzB3BdbMx8u5xOAiIIfBy67GC	1	Thanks data captured and saved	message	[]	gsgy6GrNAffxHmMglbjTSBW8utwyDqS										f			\N	f									\N	\N	\N
\.


--
-- Data for Name: sessions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sessions (id, sessionid, name, currentmenu, retries, "orgUnit", application_id, msisdn, done, started) FROM stdin;
Ka7F2QizUlw	559146435	Jesse Mdachi	64w81ibFCofqOVsyNxZMKXeITnlnzjc	0	m0frOspS7JY	1	255738238564	t	2020-03-31 14:52:42.735+03
m9XH8SkdVNK	643618228	Jesse Mdachi	64w81ibFCofqOVsyNxZMKXeITnlnzjc	0	m0frOspS7JY	1	255738238564	t	2020-03-31 13:41:32.875+03
brUzqLsSzYK	517996192	Jesse Mdachi	64w81ibFCofqOVsyNxZMKXeITnlnzjc	0	m0frOspS7JY	1	255738238564	t	2020-03-31 13:23:04.044+03
QyRjRnNUizp	841228322	Jesse Mdachi	64w81ibFCofqOVsyNxZMKXeITnlnzjc	0	m0frOspS7JY	1	255738238564	t	2020-03-31 13:49:26.596+03
q3W8SVlnxpx	372181118	Jesse Mdachi	64w81ibFCofqOVsyNxZMKXeITnlnzjc	0	m0frOspS7JY	1	255738238564	t	2020-03-31 13:26:04.511+03
\.


--
-- Data for Name: sms; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sms (sms_id, text, status, phone_numbers, session_id) FROM stdin;
\.


--
-- Data for Name: sync; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sync (id, syncserver_id, session_id, synced, retries, notified) FROM stdin;
9	1	517996192	t	1	\N
10	1	372181118	t	2	\N
11	1	643618228	t	2	\N
12	1	841228322	t	2	\N
13	1	559146435	t	1	\N
\.


--
-- Data for Name: sync_server; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sync_server (id, application_id, url, username, password, admin_email) FROM stdin;
1	1	https://hisptz.com/idsr	jmdachi	Mdachi@2020	jessejustinm@gmail.com
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, name, "phoneNumber", sessionid) FROM stdin;
\.


--
-- Name: application_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.application_id_seq', 1, true);


--
-- Name: datavalues_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.datavalues_id_seq', 352, true);


--
-- Name: knex_migrations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.knex_migrations_id_seq', 186, true);


--
-- Name: menu_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.menu_id_seq', 387, true);


--
-- Name: sms_sms_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.sms_sms_id_seq', 1, false);


--
-- Name: sync_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.sync_id_seq', 13, true);


--
-- Name: sync_server_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.sync_server_id_seq', 1, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 1, false);


--
-- Name: application application_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.application
    ADD CONSTRAINT application_pkey PRIMARY KEY (id);


--
-- Name: datavalues datavalues_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.datavalues
    ADD CONSTRAINT datavalues_pkey PRIMARY KEY (id);


--
-- Name: knex_migrations knex_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.knex_migrations
    ADD CONSTRAINT knex_migrations_pkey PRIMARY KEY (id);


--
-- Name: menu menu_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.menu
    ADD CONSTRAINT menu_pkey PRIMARY KEY (id);


--
-- Name: sms sms_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sms
    ADD CONSTRAINT sms_pkey PRIMARY KEY (sms_id);


--
-- Name: sync sync_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sync
    ADD CONSTRAINT sync_pkey PRIMARY KEY (id);


--
-- Name: sync_server sync_server_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sync_server
    ADD CONSTRAINT sync_server_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- PostgreSQL database dump complete
--

