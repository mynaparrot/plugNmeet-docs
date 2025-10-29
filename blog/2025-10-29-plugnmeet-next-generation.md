---
title: "A Major Leap Forward: Announcing the Next Generation of Plug-N-Meet"
slug: plugnmeet-next-generation
authors: [jibon]
tags: [release, update, react, vite, recorder, scalability, developer, ui-ux]
---

We are thrilled to announce a landmark update for the Plug-N-Meet ecosystem, featuring a completely redesigned client and a more powerful, scalable recorder. These updates are the result of countless hours of development aimed at enhancing user experience, boosting performance, and providing developers with even more flexibility.

We're aiming to publish the new client **before Christmas**, but you don't have to wait to see what's coming. You can preview the future right now! Just click the **"Demo"** link from our website's main menu and select the **"Development version"** to get a sneak peek.

Let's dive into what’s new.

<!--truncate-->

---

### **The New Client: A Completely Reimagined Experience**

We have rebuilt the Plug-N-Meet front-end from the ground up to be lighter, faster, and more intuitive than ever before.

**A Fresh, Modern UI**

The first thing you'll notice is the stunning new user interface. Every component, from the control bar to the settings panel, has been redesigned for a cleaner look, smoother animations, and a more logical workflow. The result is a user experience that is not just more aesthetically pleasing, but also easier to navigate.

**Under the Hood: A Blazing-Fast and Developer-Friendly Core**

This isn't just a facelift. We've modernized the entire tech stack for a massive performance boost and a superior developer experience:
*   **Upgraded to React 19:** Leveraging the latest features from the React framework for a more efficient UI.
*   **Next-Generation Whiteboard:** We've integrated the newest version of Excalidraw for a more feature-rich and responsive collaborative experience.
*   **Vite with Rolldown:** We have migrated our build system from Webpack to the cutting-edge Vite, powered by Rolldown. This means significantly faster development builds and a more optimized, lightweight production bundle.
*   **A Refactored & Modernized Codebase:** The entire client has been architecturally improved, making the code cleaner, more modular, and easier for developers to understand, customize, and contribute to.
*   **Zero-Knowledge Security Models:** The new client brings to life our most advanced security options, including support for `enabled_self_insert_encryption_key`. This allows users to provide their own encryption keys for a true zero-knowledge session, a feature we detailed in our [guide to E2EE key models](/blog/e2ee-key-models-guide).
*   ...and many more improvements!

#### **What This Upgrade Means For You**

We've worked hard to make this transition as smooth as possible.

*   **For Users of Our Official Plugins (WordPress, Moodle, Joomla):**
    You don't need to worry about a thing. Simply update the plugin from your platform's marketplace after you've updated your Plug-N-Meet server. The new client will be loaded automatically.

*   **For Developers with Custom Integrations (`getClientFiles`):**
    This is a critical update. To achieve the new performance standards, the client now utilizes modern **ES Modules**. This requires a small but important change to how you inject the JavaScript files into your application.

    **The Core Logic (Language-Agnostic):**
    Previously, all JavaScript files could be loaded with a standard `<script>` tag. Now, you must differentiate between the main module script and the other scripts.

    1.  When you loop through the `js_files` array returned by the API, you need to check the filename of each script.
    2.  If the filename **starts with `main-module.`**, you must render its `<script>` tag with `type="module"`.
    3.  For all other JavaScript files, you should render the `<script>` tag as before, preferably with a `defer` attribute to avoid blocking page render.

    This logic can be implemented in any server-side language or templating engine (Python, Node.js, Ruby, etc.) by performing a simple string check on the filename.

    **Implementation Example (PHP):**
    Here is a PHP example demonstrating how to implement this conditional logic:

    ```php
    <?php foreach ($api_response['js'] as $js_file): ?>
        <?php if (str_starts_with($js_file, 'main-module.')):
            <script src="<?php echo $assets_path . '/js/' . $js_file ?>" type="module"></script>
        <?php else: ?>
            <script src="<?php echo $assets_path . '/js/' . $js_file ?>" defer="defer"></script>
        <?php endif; ?>
    <?php endforeach; ?>
    ```

    By following this logic, you can ensure the new, faster client loads correctly in your custom application.

---

### **The New Recorder: A Scalable & Resilient Pipeline**

One of the most common bottlenecks in any live video platform is recording. Previously, as soon as a recording ended, the same server that was handling live meetings would begin the CPU-intensive task of post-processing (transcoding), which could impact the performance of other active sessions.

With the new `plugnmeet-recorder`, we've completely solved this problem by introducing **Operational Modes**.

Each recorder instance can now be configured to run as a specialized worker, allowing you to build a powerful, decoupled, and highly scalable recording pipeline.

*   **`recorderOnly` Mode:** This worker's only job is to record the live session to a raw file. Once finished, it publishes a "transcoding job" to a queue and immediately frees itself up to record another session. It never gets bogged down by post-processing.

*   **`transcoderOnly` Mode:** This worker does the heavy lifting. It subscribes to the job queue, picks up transcoding tasks one by one, and converts the raw files into the final MP4 format.

*   **`both` Mode (Default):** For smaller setups, a single instance can still perform both functions, just as it did before.

#### **Why This is a Game-Changer**

This new architecture allows you to build a truly professional-grade recording system:
*   **Scalability:** You can run a fleet of `transcoderOnly` workers on separate, cheaper VMs, processing dozens of recordings in parallel without ever affecting the performance of your live meetings.
*   **Resilience:** If a `transcoderOnly` worker fails, the job simply remains in the queue until another worker picks it up. No recordings are lost.
*   **Performance:** Your `recorderOnly` workers stay lightweight and responsive, ensuring the quality of your live session recordings is never compromised by CPU load.

---

### **Conclusion**

This release marks a significant step forward in our mission to provide the most powerful, flexible, and high-performance open-source video conferencing platform. The redesigned client delivers a world-class user experience, while the new recorder architecture provides the scalability and resilience needed for enterprise-grade deployments.

We can't wait for you to experience the new Plug-N-Meet.

**Ready to upgrade?**

*   **[Explore the Open-Source Project on GitHub](https://github.com/mynaparrot/plugNmeet-server)**
*   **[Review the updated API Documentation](/docs/api/get-client-files)**
*   **[Check out the Live Demo to see the new UI in action](https://demo.plugnmeet.com/landing.html)**
