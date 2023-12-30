--
-- PostgreSQL database dump
--

-- Dumped from database version 16.0
-- Dumped by pg_dump version 16.0

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
-- Name: auth; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA auth;


--
-- Name: account_status; Type: TYPE; Schema: auth; Owner: -
--

CREATE TYPE auth.account_status AS ENUM (
    'Active',
    'Suspended',
    'Deleted',
    'Pending Verification'
);


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: buddy_requests; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.buddy_requests (
    request_id integer NOT NULL,
    requestor_id integer,
    recipient_id integer,
    status character varying(10),
    "timestamp" timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: buddy_requests_request_id_seq; Type: SEQUENCE; Schema: auth; Owner: -
--

CREATE SEQUENCE auth.buddy_requests_request_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: buddy_requests_request_id_seq; Type: SEQUENCE OWNED BY; Schema: auth; Owner: -
--

ALTER SEQUENCE auth.buddy_requests_request_id_seq OWNED BY auth.buddy_requests.request_id;


--
-- Name: content_types; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.content_types (
    content_type_id integer NOT NULL,
    content_type_name character varying(50) NOT NULL,
    CONSTRAINT content_types_content_type_name_check CHECK (((content_type_name)::text = ANY (ARRAY[('long-form video'::character varying)::text, ('short-form video'::character varying)::text, ('long-form writing'::character varying)::text, ('mid-form writing'::character varying)::text, ('mid-form writing & design'::character varying)::text, ('short-form writing'::character varying)::text])))
);


--
-- Name: content_types_content_type_id_seq; Type: SEQUENCE; Schema: auth; Owner: -
--

CREATE SEQUENCE auth.content_types_content_type_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: content_types_content_type_id_seq; Type: SEQUENCE OWNED BY; Schema: auth; Owner: -
--

ALTER SEQUENCE auth.content_types_content_type_id_seq OWNED BY auth.content_types.content_type_id;


--
-- Name: newsfeed_items; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.newsfeed_items (
    item_id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    type character varying(10) NOT NULL,
    content text,
    parent_id uuid,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    user_id bigint,
    private_feedid uuid,
    shared_feedid uuid,
    CONSTRAINT newsfeed_items_type_check CHECK (((type)::text = ANY ((ARRAY['post'::character varying, 'comment'::character varying])::text[])))
);


--
-- Name: newsfeed_likes; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.newsfeed_likes (
    like_id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    user_id integer NOT NULL,
    item_id uuid NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: newsfeed_saveditem; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.newsfeed_saveditem (
    savedpost_id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id integer NOT NULL,
    item_id uuid NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: newsfeeds; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.newsfeeds (
    user_id bigint,
    private_feedid uuid DEFAULT public.uuid_generate_v4(),
    shared_feedid uuid DEFAULT public.uuid_generate_v4(),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    buddy_id bigint DEFAULT '-1'::integer
);


--
-- Name: user_profile; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.user_profile (
    id integer NOT NULL,
    first_name character varying(50) NOT NULL,
    last_name character varying(50) NOT NULL,
    country character varying(100),
    user_content_id integer,
    content_type character varying(300),
    gmt_offset character varying(20),
    screen_preference character varying(50)
);


--
-- Name: user_profile_id_seq; Type: SEQUENCE; Schema: auth; Owner: -
--

CREATE SEQUENCE auth.user_profile_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: user_profile_id_seq; Type: SEQUENCE OWNED BY; Schema: auth; Owner: -
--

ALTER SEQUENCE auth.user_profile_id_seq OWNED BY auth.user_profile.id;


--
-- Name: users; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.users (
    userid integer NOT NULL,
    email character varying(100) NOT NULL,
    email_verified boolean,
    passwordhash character varying(256) NOT NULL,
    datecreated timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    lastlogin timestamp without time zone,
    status public.account_status NOT NULL,
    email_verification_timestamp timestamp with time zone
);


--
-- Name: users_userid_seq; Type: SEQUENCE; Schema: auth; Owner: -
--

CREATE SEQUENCE auth.users_userid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: users_userid_seq; Type: SEQUENCE OWNED BY; Schema: auth; Owner: -
--

ALTER SEQUENCE auth.users_userid_seq OWNED BY auth.users.userid;


--
-- Name: buddy_requests request_id; Type: DEFAULT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.buddy_requests ALTER COLUMN request_id SET DEFAULT nextval('auth.buddy_requests_request_id_seq'::regclass);


--
-- Name: content_types content_type_id; Type: DEFAULT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.content_types ALTER COLUMN content_type_id SET DEFAULT nextval('auth.content_types_content_type_id_seq'::regclass);


--
-- Name: user_profile id; Type: DEFAULT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.user_profile ALTER COLUMN id SET DEFAULT nextval('auth.user_profile_id_seq'::regclass);


--
-- Name: users userid; Type: DEFAULT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.users ALTER COLUMN userid SET DEFAULT nextval('auth.users_userid_seq'::regclass);


--
-- Name: buddy_requests buddy_requests_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.buddy_requests
    ADD CONSTRAINT buddy_requests_pkey PRIMARY KEY (request_id);


--
-- Name: content_types content_types_content_type_name_key; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.content_types
    ADD CONSTRAINT content_types_content_type_name_key UNIQUE (content_type_name);


--
-- Name: content_types content_types_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.content_types
    ADD CONSTRAINT content_types_pkey PRIMARY KEY (content_type_id);


--
-- Name: newsfeed_items newsfeed_items_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.newsfeed_items
    ADD CONSTRAINT newsfeed_items_pkey PRIMARY KEY (item_id);


--
-- Name: newsfeed_likes newsfeed_likes_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.newsfeed_likes
    ADD CONSTRAINT newsfeed_likes_pkey PRIMARY KEY (like_id);


--
-- Name: newsfeed_likes newsfeed_likes_user_id_item_id_key; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.newsfeed_likes
    ADD CONSTRAINT newsfeed_likes_user_id_item_id_key UNIQUE (user_id, item_id);


--
-- Name: newsfeed_saveditem newsfeed_saveditem_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.newsfeed_saveditem
    ADD CONSTRAINT newsfeed_saveditem_pkey PRIMARY KEY (savedpost_id);


--
-- Name: newsfeed_saveditem newsfeed_saveditem_user_id_item_id_key; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.newsfeed_saveditem
    ADD CONSTRAINT newsfeed_saveditem_user_id_item_id_key UNIQUE (user_id, item_id);


--
-- Name: newsfeeds newsfeeds_private_feedid_key; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.newsfeeds
    ADD CONSTRAINT newsfeeds_private_feedid_key UNIQUE (private_feedid);


--
-- Name: newsfeeds newsfeeds_user_id_key; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.newsfeeds
    ADD CONSTRAINT newsfeeds_user_id_key UNIQUE (user_id);


--
-- Name: buddy_requests unique_buddy_request; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.buddy_requests
    ADD CONSTRAINT unique_buddy_request UNIQUE (requestor_id, recipient_id);


--
-- Name: user_profile user_profile_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.user_profile
    ADD CONSTRAINT user_profile_pkey PRIMARY KEY (id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (userid);


--
-- Name: newsfeed_likes fk_item; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.newsfeed_likes
    ADD CONSTRAINT fk_item FOREIGN KEY (item_id) REFERENCES auth.newsfeed_items(item_id) ON DELETE CASCADE;


--
-- Name: newsfeed_saveditem fk_post; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.newsfeed_saveditem
    ADD CONSTRAINT fk_post FOREIGN KEY (item_id) REFERENCES auth.newsfeed_items(item_id) ON DELETE CASCADE;


--
-- Name: newsfeed_likes fk_user; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.newsfeed_likes
    ADD CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES auth.newsfeeds(user_id) ON DELETE CASCADE;


--
-- Name: newsfeed_saveditem fk_user; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.newsfeed_saveditem
    ADD CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES auth.newsfeeds(user_id) ON DELETE CASCADE;


--
-- Name: user_profile fk_user_content; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.user_profile
    ADD CONSTRAINT fk_user_content FOREIGN KEY (user_content_id) REFERENCES auth.users(userid);


--
-- Name: newsfeed_items newsfeed_items_parent_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.newsfeed_items
    ADD CONSTRAINT newsfeed_items_parent_id_fkey FOREIGN KEY (parent_id) REFERENCES auth.newsfeed_items(item_id);


--
-- Name: newsfeed_items newsfeed_items_private_feedid_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.newsfeed_items
    ADD CONSTRAINT newsfeed_items_private_feedid_fkey FOREIGN KEY (private_feedid) REFERENCES auth.newsfeeds(private_feedid);


--
-- Name: newsfeed_items newsfeed_items_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.newsfeed_items
    ADD CONSTRAINT newsfeed_items_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.newsfeeds(user_id);


--
-- Name: newsfeeds newsfeeds_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.newsfeeds
    ADD CONSTRAINT newsfeeds_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(userid);


--
-- PostgreSQL database dump complete
--

