--
-- PostgreSQL database dump
--

-- Dumped from database version 10.12 (Debian 10.12-2.pgdg90+1)
-- Dumped by pg_dump version 10.12 (Debian 10.12-2.pgdg90+1)

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
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: application; Type: TABLE; Schema: public; Owner: -
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


--
-- Name: application_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.application_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: application_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.application_id_seq OWNED BY public.application.id;


--
-- Name: datavalues; Type: TABLE; Schema: public; Owner: -
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
    data_set character varying(255),
    "trackedEntityType" character varying(255)
);


--
-- Name: datavalues_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.datavalues_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: datavalues_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.datavalues_id_seq OWNED BY public.datavalues.id;


--
-- Name: knex_migrations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.knex_migrations (
    id integer NOT NULL,
    name character varying(255),
    batch integer,
    migration_time timestamp with time zone
);


--
-- Name: knex_migrations_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.knex_migrations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: knex_migrations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.knex_migrations_id_seq OWNED BY public.knex_migrations.id;


--
-- Name: knex_migrations_lock; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.knex_migrations_lock (
    is_locked integer
);


--
-- Name: menu; Type: TABLE; Schema: public; Owner: -
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


--
-- Name: menu_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.menu_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: menu_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.menu_id_seq OWNED BY public.menu.id;


--
-- Name: sessions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.sessions (
    id character varying(255),
    sessionid character varying(255),
    name character varying(255),
    currentmenu character varying(255),
    datastore json,
    retries integer,
    "orgUnit" character varying(255),
    application_id character varying(255),
    msisdn character varying(255),
    done boolean,
    started timestamp with time zone
);


--
-- Name: sms; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.sms (
    sms_id integer NOT NULL,
    text character varying(255),
    status character varying(255),
    phone_numbers json,
    session_id character varying(255)
);


--
-- Name: sms_sms_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.sms_sms_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: sms_sms_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.sms_sms_id_seq OWNED BY public.sms.sms_id;


--
-- Name: sync; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.sync (
    id integer NOT NULL,
    syncserver_id character varying(255),
    session_id character varying(255),
    synced boolean,
    retries integer,
    notified boolean
);


--
-- Name: sync_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.sync_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: sync_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.sync_id_seq OWNED BY public.sync.id;


--
-- Name: sync_server; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.sync_server (
    id integer NOT NULL,
    application_id character varying(255),
    url character varying(255),
    username character varying(255),
    password character varying(255),
    admin_email character varying(255)
);


--
-- Name: sync_server_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.sync_server_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: sync_server_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.sync_server_id_seq OWNED BY public.sync_server.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id integer NOT NULL,
    name character varying(255),
    "phoneNumber" character varying(255),
    sessionid character varying(255)
);


--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: application id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.application ALTER COLUMN id SET DEFAULT nextval('public.application_id_seq'::regclass);


--
-- Name: datavalues id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.datavalues ALTER COLUMN id SET DEFAULT nextval('public.datavalues_id_seq'::regclass);


--
-- Name: knex_migrations id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.knex_migrations ALTER COLUMN id SET DEFAULT nextval('public.knex_migrations_id_seq'::regclass);


--
-- Name: menu id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.menu ALTER COLUMN id SET DEFAULT nextval('public.menu_id_seq'::regclass);


--
-- Name: sms sms_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sms ALTER COLUMN sms_id SET DEFAULT nextval('public.sms_sms_id_seq'::regclass);


--
-- Name: sync id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sync ALTER COLUMN id SET DEFAULT nextval('public.sync_id_seq'::regclass);


--
-- Name: sync_server id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sync_server ALTER COLUMN id SET DEFAULT nextval('public.sync_server_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: application; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.application (id, name, update_date, description, session_key, user_response, datastore_key, key, first_request, continue_request, terminated_by_provider, timed_out, phone_number_key, no_user_message, starting_menu, sync_servers, auth_based_on, session_timeout_determinant, phone_number_mapping, auto_generated_field) FROM stdin;
1	IDSR USSD Manager	2021-01-04T12:05:48.903	Ussd manager for IDSR project	sessionid	USSDRequest	idsr	USSDType	NR	CR	UC	T	msisdn	Samahani hujasajiliwa kutumia mfumo wa eIDSR	VkkB3zN0ljWIKZjyCLyKdkgNAZ8fMe9	\N		{}	\N	\N
2	IDSR USSD Manager	2021-02-15T09:31:15.657	Ussd manager for IDSR project	sessionid	USSDRequest	idsr-ega	USSDType	NR	CR	UC	T	msisdn	Samahani hujasajiliwa kutumia mfumo wa eIDSR	VkkB3zN0ljWIKZjyCLyKdkgNAZ8fMe9	\N		{}	\N	\N
3	IDSR USSD Test	2020-11-20T13:44:23.075	Ussd manager for IDSR project	sessionid	USSDRequest	test-idsr	USSDType	NR	CR	UC	T	msisdn	Samahani hujasajiliwa kutumia mfumo wa eIDSR	VkkB3zN0ljWIKZjyCLyKdkgNAZ8fMe9	\N		{}	\N	\N
\.


--
-- Data for Name: datavalues; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.datavalues (id, sessionid, period, year, datatype, program, "programStage", "dataValues", data_set, "trackedEntityType") FROM stdin;
\.


--
-- Data for Name: knex_migrations; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.knex_migrations (id, name, batch, migration_time) FROM stdin;
1	20160802144759_users.js	1	2021-05-05 08:01:33.767+00
2	20180319123215_sessions.js	1	2021-05-05 08:01:33.771+00
3	20180326112127_datavalues.js	1	2021-05-05 08:01:33.776+00
4	20200309132207_application.js	1	2021-05-05 08:01:33.781+00
5	20200309132807_sync_server.js	1	2021-05-05 08:01:33.786+00
6	20200309132817_sync.js	1	2021-05-05 08:01:33.791+00
7	20200309132829_sms.js	1	2021-05-05 08:01:33.795+00
8	20200309132845_menu.js	1	2021-05-05 08:01:33.801+00
\.


--
-- Data for Name: knex_migrations_lock; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.knex_migrations_lock (is_locked) FROM stdin;
0
\.


--
-- Data for Name: menu; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.menu (id, menu_id, application_id, title, type, options, previous_menu, data_id, next_menu, data_type, data_name, auth_key, fail_message, retry_message, number_of_retries, submission_message, submit_data, p_rules, period_type, maximum_value, use_for_year, years_back, field_value_type, field_short_name, data_element, category_combo, data_set, program, program_stage, mode, tracked_entity_type, tracked_entity_attribute) FROM stdin;
\.


--
-- Data for Name: sessions; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.sessions (id, sessionid, name, currentmenu, datastore, retries, "orgUnit", application_id, msisdn, done, started) FROM stdin;
\.


--
-- Data for Name: sms; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.sms (sms_id, text, status, phone_numbers, session_id) FROM stdin;
\.


--
-- Data for Name: sync; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.sync (id, syncserver_id, session_id, synced, retries, notified) FROM stdin;
\.


--
-- Data for Name: sync_server; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.sync_server (id, application_id, url, username, password, admin_email) FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.users (id, name, "phoneNumber", sessionid) FROM stdin;
\.


--
-- Name: application_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.application_id_seq', 3, true);


--
-- Name: datavalues_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.datavalues_id_seq', 1, false);


--
-- Name: knex_migrations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.knex_migrations_id_seq', 8, true);


--
-- Name: menu_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.menu_id_seq', 1, false);


--
-- Name: sms_sms_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.sms_sms_id_seq', 1, false);


--
-- Name: sync_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.sync_id_seq', 1, false);


--
-- Name: sync_server_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.sync_server_id_seq', 1, false);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.users_id_seq', 1, false);


--
-- Name: application application_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.application
    ADD CONSTRAINT application_pkey PRIMARY KEY (id);


--
-- Name: datavalues datavalues_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.datavalues
    ADD CONSTRAINT datavalues_pkey PRIMARY KEY (id);


--
-- Name: knex_migrations knex_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.knex_migrations
    ADD CONSTRAINT knex_migrations_pkey PRIMARY KEY (id);


--
-- Name: menu menu_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.menu
    ADD CONSTRAINT menu_pkey PRIMARY KEY (id);


--
-- Name: sms sms_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sms
    ADD CONSTRAINT sms_pkey PRIMARY KEY (sms_id);


--
-- Name: sync sync_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sync
    ADD CONSTRAINT sync_pkey PRIMARY KEY (id);


--
-- Name: sync_server sync_server_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sync_server
    ADD CONSTRAINT sync_server_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- PostgreSQL database dump complete
--

