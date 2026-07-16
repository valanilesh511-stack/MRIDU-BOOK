# MRIDU BOOK STUDIO

Offline-first professional writing studio for Indian languages (Hindi, Gujarati, Sanskrit, English).

## 🎯 Goal
Provide a distraction-free, reliable writing experience comparable to Google Docs + Kindle, with perfect support for complex Indian scripts.

## 🏗️ Architecture
- **Permanent Core** (12 files) – never changes. Provides Events, Storage, State, Unicode, ISCL.
- **Replaceable Modules** – Writer, Reader, Library, Bookmarks, Search, Import/Export.
- **Offline** – IndexedDB, Service Worker, no internet required.

## 📁 Project Structure
index.html           # Application shell (frozen)
boot.json            # Asset loader (frozen)
manifest.json        # PWA
sw.js                # Dynamic caching
core/                # Frozen core services
modules/             # Replaceable feature modules
themes/              # CSS themes

## 🚀 Quick Start
Open `index.html` in a modern browser or deploy the whole folder to any static host.

## 🔒 Core Freeze
The core is frozen at version 1.0.0. Any changes require an Architecture Change Proposal (ACP).

## 📜 License
MIT