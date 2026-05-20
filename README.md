## ROADSoS – Smart Emergency Response & Road Safety Platform

## Overview

ROADSoS is a smart emergency response and roadside assistance platform designed to reduce emergency response time during road accidents and roadside emergencies.

The platform provides:

Real-time nearby emergency services

SOS emergency alert system

Live GPS location sharing

Nearby hospitals and police stations

Trusted emergency contacts

Offline-friendly emergency workflow

Installable Progressive Web App (PWA)

ROADSoS was developed as a hackathon MVP focused on accessibility, rapid emergency assistance, and road safety innovation.

## Key Features

Smart SOS Alert System

One-tap emergency activation

10-second emergency countdown

Automatic SOS triggering

Sends live GPS location

Native SMS integration

Works even with limited connectivity

Live GPS Tracking

Real-time user location detection

Interactive OpenStreetMap integration

Auto-centering live location marker

Location-aware emergency assistance

Nearby Emergency Services

## Fetches nearby:

Hospitals

Trauma centers

Police stations

Towing/vehicle repair services

## Features:

Real phone number fetching

Direct call support

Navigation routing

Dynamic location-based search

Trusted Emergency Contacts

Add/Edit/Delete emergency contacts

Persistent local storage support

Firebase synchronization

Emergency broadcast messaging

Progressive Web App (PWA)

## ROADSoS is installable as a mobile-style application:

Add to Home Screen support

Fullscreen standalone mode

Offline-ready UI caching

Mobile-optimized experience

Firebase Integration

Firebase Authentication

Firestore cloud synchronization

Secure environment variable configuration

Offline fallback architecture

Offline-Friendly Architecture

## Even without stable internet:

Emergency contacts remain accessible

SOS workflow remains functional

Native SMS fallback works

Cached UI remains available

## Tech Stack

Frontend

React.js

Vite

React Router

Tailwind CSS

Maps & Location

OpenStreetMap

React Leaflet

Browser Geolocation API

Overpass API

Backend & Cloud

Firebase Authentication

Firebase Firestore

Netlify Functions

State Management

Zustand

PWA Support

Service Workers

Web Manifest

## Project Architecture

ROADSoS
│
├── Frontend (React + Vite)
│   ├── Dashboard
│   ├── SOS Activation
│   ├── Nearby Services
│   ├── Trusted Contacts
│   └── Settings
│
├── Maps & Geolocation
│   ├── OpenStreetMap
│   ├── Leaflet
│   └── GPS Tracking
│
├── Backend Services
│   ├── Firebase Auth
│   ├── Firestore
│   └── Netlify Functions
│
└── Emergency Systems
    ├── SMS Intent
    ├── Live Location Sharing
    ├── Phone Resolution
    └── Offline Support

Installation & Setup
Clone Repository
git clone https://github.com/Hemapriya26/stitch_roadsos_emergency_response_app.git

cd roadsos-app

## Install Dependencies

npm install

## Environment Variables

Create a .env file in the root directory:

VITE_FIREBASE_API_KEY=your_api_key

VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain

VITE_FIREBASE_PROJECT_ID=your_project_id

VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket

VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id

VITE_FIREBASE_APP_ID=your_app_id

## Run Development Server

npm run dev

## Production Build

npm run build

## Deployment

Netlify Deployment

## Build Settings:

Base Directory: roadsos-app

Build Command: npm run build

Publish Directory: roadsos-app/dist

Environment variables must also be added inside Netlify project settings.

## Firebase Setup
Create a Firebase project

Enable Authentication

Enable Firestore Database

Add Web App

Copy Firebase configuration

Add deployed domain to Authorized Domains

Security Notes

Firebase configuration is handled through environment variables

Firestore rules restrict unauthorized access

Sensitive credentials are excluded from Git tracking

Offline fallback prevents total dependency on cloud services

## Future Enhancements

AI-based accident detection

Voice-triggered SOS

IoT crash sensor integration

Ambulance dispatch optimization

Real-time traffic analysis

Multilingual accessibility support

Blockchain-based service verification

## Use Cases

Road accidents

Vehicle breakdowns

Medical emergencies

Women safety assistance

Rural emergency access

Disaster response coordination

Challenges Solved

Delayed emergency response

Difficulty finding nearby hospitals

Lack of emergency coordination

Connectivity limitations

Roadside assistance delays

Target Impact

## ROADSoS aims to:

Reduce emergency response delays

Improve public road safety

Enhance emergency accessibility

Provide fast roadside assistance

Support safer smart-city infrastructure

Contributors

Developed for road safety innovation and emergency response enhancement.

## Author 

Hemapriya P

BE.CSE

Saveetha Engineering College
