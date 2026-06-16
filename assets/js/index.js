const init = () => {
    // 1. Progressive Enhancement: Trigger JS visual state hide triggers
    document.documentElement.classList.add('js-active');

    // 2. Fade out and remove loading overlay
    const overlay = document.getElementById('landing-overlay');
    if (overlay) {
        setTimeout(() => {
            overlay.classList.add('fade-out');
            setTimeout(() => {
                overlay.remove();
            }, 800);
        }, 500);
    }

    // 3. Entrance Animation Sequence Active Trigger
    setTimeout(() => {
        document.body.classList.add('entrance-active');
    }, 100);

    // 4. Theme Management (Light / Dark)
    let needsRedraw = true;
    const themeToggleBtn = document.getElementById('theme-toggle');
    const setTheme = (theme) => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    };

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            setTheme(newTheme);
            needsRedraw = true;
        });
    }


    // 5. Sticky Header scroll listener
    const header = document.getElementById('header');
    const handleScroll = () => {
        if (!header) return;
        if (window.scrollY > 20) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();

    // 6. Mobile Hamburger Menu Toggle
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileMenuLinks = document.querySelectorAll('.mobile-menu-link');

    if (mobileMenuBtn && mobileMenu) {
        const toggleMobileMenu = () => {
            const isActive = mobileMenuBtn.classList.toggle('active');
            mobileMenu.classList.toggle('active');
            mobileMenuBtn.setAttribute('aria-expanded', isActive);
            
            if (isActive) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        };

        mobileMenuBtn.addEventListener('click', toggleMobileMenu);
        mobileMenuLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (mobileMenu.classList.contains('active')) {
                    toggleMobileMenu();
                }
            });
        });
    }

    // 7. Mouse-following premium card light glow effect (magnetic follow)
    const cards = document.querySelectorAll('.card, .focus-item');
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            card.style.setProperty('--x', `${x}px`);
            card.style.setProperty('--y', `${y}px`);
        });
    });

    // 8. Cursor Spotlight Tracker
    const spotlight = document.getElementById('cursor-spotlight');
    document.addEventListener('mousemove', (e) => {
        if (spotlight) {
            spotlight.style.left = `${e.clientX}px`;
            spotlight.style.top = `${e.clientY}px`;
            if (!spotlight.classList.contains('active')) {
                spotlight.classList.add('active');
            }
        }
    });
    document.addEventListener('mouseleave', () => {
        if (spotlight) spotlight.classList.remove('active');
    });

    // 9. Mouse Coordinate Tracker for Parallax
    let mouseX = 0, mouseY = 0;
    let targetMouseX = 0, targetMouseY = 0;
    const ease = 0.08;

    document.addEventListener('mousemove', (e) => {
        targetMouseX = e.clientX - window.innerWidth / 2;
        targetMouseY = e.clientY - window.innerHeight / 2;
    });

    // 10. Background Canvases Initialization
    const bgCanvas = document.getElementById('bg-canvas');
    const bgCtx = bgCanvas ? bgCanvas.getContext('2d') : null;
    
    const particleCanvas = document.getElementById('particle-canvas');
    const particleCtx = particleCanvas ? particleCanvas.getContext('2d') : null;
    
    let width = 0, height = 0;

    const resizeCanvases = () => {
        width = window.innerWidth;
        height = window.innerHeight;
        
        if (bgCanvas) {
            bgCanvas.width = width;
            bgCanvas.height = height;
        }
        if (particleCanvas) {
            particleCanvas.width = width;
            particleCanvas.height = height;
        }
        needsRedraw = true;
    };
    window.addEventListener('resize', resizeCanvases);
    resizeCanvases();


    // 3D Projection Helpers
    const rotateX = (p, a) => {
        const c = Math.cos(a), s = Math.sin(a);
        return { x: p.x, y: p.y * c - p.z * s, z: p.y * s + p.z * c };
    };
    const rotateY = (p, a) => {
        const c = Math.cos(a), s = Math.sin(a);
        return { x: p.x * c + p.z * s, y: p.y, z: -p.x * s + p.z * c };
    };
    const rotateZ = (p, a) => {
        const c = Math.cos(a), s = Math.sin(a);
        return { x: p.x * c - p.y * s, y: p.x * s + p.y * c, z: p.z };
    };

    // Layer 1 & 2 background decorations - Disabled for visual pivot
    const spheres = [];
    const shapes = [];

    // Layer 3 - Particles (z-index: -1) - Reduced particle density by 77% (only 25 specks)
    const particles = [];
    const numParticles = 25;
    for (let i = 0; i < numParticles; i++) {
        particles.push({
            xPct: Math.random(),
            yPct: Math.random(),
            vx: (Math.random() - 0.5) * 0.00015, // slower drift
            vy: (Math.random() - 0.5) * 0.00015,
            radius: Math.random() * 1.5 + 0.5    // smaller dust specks
        });
    }

    // 11. Hero Neural-Net Canvas System
    const heroCanvas = document.getElementById('hero-canvas');
    const heroCtx = heroCanvas ? heroCanvas.getContext('2d') : null;
    let hWidth = 750, hHeight = 750; // Coordinates scale internally, rendered sharp at 650px CSS
    
    if (heroCanvas) {
        heroCanvas.width = hWidth;
        heroCanvas.height = hHeight;
    }

    // 3D Cuboid Generator Helper
    const createCuboid = (w, h, d, ox, oy, oz) => {
        const hw = w / 2;
        const hh = h / 2;
        const hd = d / 2;
        
        const vertices = [
            {x: -hw + ox, y: -hh + oy, z: -hd + oz}, // 0
            {x: hw + ox, y: -hh + oy, z: -hd + oz},  // 1
            {x: hw + ox, y: hh + oy, z: -hd + oz},   // 2
            {x: -hw + ox, y: hh + oy, z: -hd + oz},  // 3
            {x: -hw + ox, y: -hh + oy, z: hd + oz},  // 4
            {x: hw + ox, y: -hh + oy, z: hd + oz},   // 5
            {x: hw + ox, y: hh + oy, z: hd + oz},    // 6
            {x: -hw + ox, y: hh + oy, z: hd + oz}     // 7
        ];
        
        const faces = [
            { indices: [0, 1, 2, 3], label: 'front' },
            { indices: [1, 5, 6, 2], label: 'right' },
            { indices: [5, 4, 7, 6], label: 'back' },
            { indices: [4, 0, 3, 7], label: 'left' },
            { indices: [4, 5, 1, 0], label: 'top' },
            { indices: [3, 2, 6, 7], label: 'bottom' }
        ];
        
        return { vertices, faces };
    };

    // 3D Cylinder Generator Helper
    const createCylinder = (radius, height, segments, ox, oy, oz) => {
        const vertices = [];
        const faces = [];
        const hh = height / 2;
        
        // Vertices: top ring first, then bottom ring
        for (let i = 0; i < segments; i++) {
            const angle = (i / segments) * Math.PI * 2;
            vertices.push({
                x: Math.cos(angle) * radius + ox,
                y: -hh + oy,
                z: Math.sin(angle) * radius + oz
            });
        }
        for (let i = 0; i < segments; i++) {
            const angle = (i / segments) * Math.PI * 2;
            vertices.push({
                x: Math.cos(angle) * radius + ox,
                y: hh + oy,
                z: Math.sin(angle) * radius + oz
            });
        }
        
        // Top cap face (outwards/upwards normal)
        const topIndices = [];
        for (let i = segments - 1; i >= 0; i--) {
            topIndices.push(i);
        }
        faces.push({ indices: topIndices, label: 'top' });
        
        // Bottom cap face (outwards/downwards normal)
        const bottomIndices = [];
        for (let i = 0; i < segments; i++) {
            bottomIndices.push(segments + i);
        }
        faces.push({ indices: bottomIndices, label: 'bottom' });
        
        // Side faces
        for (let i = 0; i < segments; i++) {
            const next = (i + 1) % segments;
            faces.push({
                indices: [i, next, segments + next, segments + i],
                label: `side_${i}`
            });
        }
        
        return { vertices, faces };
    };

    // Instantiate editorial shapes
    const plateRose = createCuboid(115, 290, 8, -25, -25, -15);
    const plateSage = createCuboid(115, 290, 8, 35, -25, 20);
    const plateRear = createCuboid(95, 220, 8, 85, 5, 50);
    const pedestalDesktop = createCylinder(160, 35, 32, 20, 130, 10);
    const pedestalMobile = createCylinder(160, 35, 12, 20, 130, 10);


    // Orbiting silver sphere parameters
    let sphereAngle = 0;
    const sphereRadius = 24;

    // Rotation angles
    let sceneRotY = 0;
    let sceneRotX = 0;

    let lastWidth = window.innerWidth;
    let lastHeight = window.innerHeight;
    let lastTheme = document.documentElement.getAttribute('data-theme');

    // 12. Unified Animation Render Loop
    const render = () => {
        mouseX += (targetMouseX - mouseX) * ease;
        mouseY += (targetMouseY - mouseY) * ease;

        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        const isMobile = window.innerWidth < 768;
        const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;
        
        const currentWidth = window.innerWidth;
        const currentHeight = window.innerHeight;
        const currentTheme = document.documentElement.getAttribute('data-theme');

        if (currentWidth !== lastWidth || currentHeight !== lastHeight || currentTheme !== lastTheme) {
            needsRedraw = true;
            lastWidth = currentWidth;
            lastHeight = currentHeight;
            lastTheme = currentTheme;
        }

        // Draw Layer 1 (Spheres) & Layer 2 (Wireframes) on bgCanvas (z-index: -2)
        if (bgCanvas && bgCtx) {
            bgCtx.clearRect(0, 0, width, height);
            // Disabled background sphere and wireframe drawing for simplified luxury aesthetic
        }

        // Draw Layer 3 (Particles) on particleCanvas (z-index: -1)
        if (particleCanvas && particleCtx) {
            particleCtx.clearRect(0, 0, width, height);

            particles.forEach(p => {
                p.xPct += p.vx;
                p.yPct += p.vy;
                if (p.xPct < 0) p.xPct += 1;
                if (p.xPct > 1) p.xPct -= 1;
                if (p.yPct < 0) p.yPct += 1;
                if (p.yPct > 1) p.yPct -= 1;
            });

            // Very subtle particle dust, low opacity (no connection lines)
            particleCtx.fillStyle = isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(23, 23, 25, 0.12)';
            particles.forEach(p => {
                const px = p.xPct * width + mouseX * 0.03;
                const py = p.yPct * height + mouseY * 0.03;
                particleCtx.beginPath();
                particleCtx.arc(px, py, p.radius * 0.8, 0, Math.PI * 2);
                particleCtx.fill();
            });
        }

        // Draw Hero Canvas rotating editorial shape system
        if (heroCanvas && heroCtx) {
            if (isMobile && !needsRedraw) {
                // Lightweight static render on mobile: skip loop math to save CPU
            } else {
                heroCtx.clearRect(0, 0, hWidth, hHeight);

                let finalRotY, finalRotX;
                let activeScale = 0.72;
                let activePedestal = pedestalDesktop;

                if (isMobile) {
                    // Static render angles and geometry
                    finalRotY = 0.4;
                    finalRotX = -0.06;
                    sphereAngle = 0.8;
                    activeScale = 0.62;
                    activePedestal = pedestalMobile;
                    needsRedraw = false; // Reset static redraw flag
                } else if (isTablet) {
                    // Slower rotations and disabled mouse parallax on tablet viewports
                    sceneRotY += 0.0007; // Slower base rotation
                    sceneRotX = Math.sin(sceneRotY * 0.4) * 0.04;
                    finalRotY = sceneRotY;
                    finalRotX = sceneRotX;
                    sphereAngle += 0.002;
                    activeScale = 0.68;
                    activePedestal = pedestalMobile; // Reduced segment count (12)
                } else {
                    // Desktop (1024px+): full 3D sculpture, full reflections, full lighting, mouse parallax
                    sceneRotY += 0.0015;
                    sceneRotX = Math.sin(sceneRotY * 0.4) * 0.04;
                    finalRotY = sceneRotY + mouseX * 0.0006;
                    finalRotX = sceneRotX + mouseY * 0.0004;
                    sphereAngle += 0.004;
                    activeScale = 0.72;
                    activePedestal = pedestalDesktop; // Full segment count (32)
                }

                // Shift sculpture slightly left
                const projectionCenterX = hWidth / 2 - 25;
                const projectionCenterY = hHeight / 2;

                // DRAW CENTRAL ATMOSPHERIC LIGHTING BLOOM (Warm pink-beige radial glow)
                const centralGlow = heroCtx.createRadialGradient(
                    projectionCenterX, projectionCenterY, 0,
                    projectionCenterX, projectionCenterY, 300
                );
                if (isDark) {
                    centralGlow.addColorStop(0, 'rgba(199, 95, 113, 0.048)'); // Rose glow
                    centralGlow.addColorStop(0.5, 'rgba(19, 17, 16, 0.016)'); // Deep chocolate-beige transition
                    centralGlow.addColorStop(1, 'rgba(0,0,0,0)');
                } else {
                    centralGlow.addColorStop(0, 'rgba(240, 184, 184, 0.096)'); // Soft pink
                    centralGlow.addColorStop(0.5, 'rgba(250, 246, 242, 0.032)'); // Sand/beige transition
                    centralGlow.addColorStop(1, 'rgba(0,0,0,0)');
                }
                heroCtx.fillStyle = centralGlow;
                heroCtx.beginPath();
                heroCtx.arc(projectionCenterX, projectionCenterY, 300, 0, Math.PI * 2);
                heroCtx.fill();

                // Projection settings
                const distanceFactor = 1000;

                // Define light source (top-left-front)
                const light = { x: -0.577, y: -0.577, z: -0.577 };

                const renderItems = [];

                // 1. Project Plate Rose
                plateRose.faces.forEach(face => {
                    const rotatedVerts = face.indices.map(idx => {
                        const v = plateRose.vertices[idx];
                        let r = rotateY(v, finalRotY);
                        r = rotateX(r, finalRotX);
                        return r;
                    });

                    // Calculate normal
                    const v1 = { x: rotatedVerts[1].x - rotatedVerts[0].x, y: rotatedVerts[1].y - rotatedVerts[0].y, z: rotatedVerts[1].z - rotatedVerts[0].z };
                    const v2 = { x: rotatedVerts[2].x - rotatedVerts[0].x, y: rotatedVerts[2].y - rotatedVerts[0].y, z: rotatedVerts[2].z - rotatedVerts[0].z };
                    const normal = {
                        x: v1.y * v2.z - v1.z * v2.y,
                        y: v1.z * v2.x - v1.x * v2.z,
                        z: v1.x * v2.y - v1.y * v2.x
                    };
                    const len = Math.sqrt(normal.x * normal.x + normal.y * normal.y + normal.z * normal.z);
                    if (len > 0) {
                        normal.x /= len; normal.y /= len; normal.z /= len;
                    }

                    // Project points
                    const projected = rotatedVerts.map(rv => {
                        const scale = (distanceFactor / (distanceFactor + rv.z)) * activeScale;
                        return {
                            x: projectionCenterX + rv.x * scale,
                            y: projectionCenterY + rv.y * scale
                        };
                    });

                    // Calculate average depth
                    const avgZ = rotatedVerts.reduce((acc, rv) => acc + rv.z, 0) / rotatedVerts.length;

                    renderItems.push({
                        type: 'face',
                        colorLabel: 'rose',
                        label: face.label,
                        projected: projected,
                        normal: normal,
                        avgZ: avgZ
                    });
                });

                // 2. Project Plate Sage
                plateSage.faces.forEach(face => {
                    const rotatedVerts = face.indices.map(idx => {
                        const v = plateSage.vertices[idx];
                        let r = rotateY(v, finalRotY);
                        r = rotateX(r, finalRotX);
                        return r;
                    });

                    // Calculate normal
                    const v1 = { x: rotatedVerts[1].x - rotatedVerts[0].x, y: rotatedVerts[1].y - rotatedVerts[0].y, z: rotatedVerts[1].z - rotatedVerts[0].z };
                    const v2 = { x: rotatedVerts[2].x - rotatedVerts[0].x, y: rotatedVerts[2].y - rotatedVerts[0].y, z: rotatedVerts[2].z - rotatedVerts[0].z };
                    const normal = {
                        x: v1.y * v2.z - v1.z * v2.y,
                        y: v1.z * v2.x - v1.x * v2.z,
                        z: v1.x * v2.y - v1.y * v2.x
                    };
                    const len = Math.sqrt(normal.x * normal.x + normal.y * normal.y + normal.z * normal.z);
                    if (len > 0) {
                        normal.x /= len; normal.y /= len; normal.z /= len;
                    }

                    // Project points
                    const projected = rotatedVerts.map(rv => {
                        const scale = (distanceFactor / (distanceFactor + rv.z)) * activeScale;
                        return {
                            x: projectionCenterX + rv.x * scale,
                            y: projectionCenterY + rv.y * scale
                        };
                    });

                    // Calculate average depth
                    const avgZ = rotatedVerts.reduce((acc, rv) => acc + rv.z, 0) / rotatedVerts.length;

                    renderItems.push({
                        type: 'face',
                        colorLabel: 'sage',
                        label: face.label,
                        projected: projected,
                        normal: normal,
                        avgZ: avgZ
                    });
                });

                // 3. Project Plate Rear
                plateRear.faces.forEach(face => {
                    const rotatedVerts = face.indices.map(idx => {
                        const v = plateRear.vertices[idx];
                        let r = rotateY(v, finalRotY);
                        r = rotateX(r, finalRotX);
                        return r;
                    });

                    // Calculate normal
                    const v1 = { x: rotatedVerts[1].x - rotatedVerts[0].x, y: rotatedVerts[1].y - rotatedVerts[0].y, z: rotatedVerts[1].z - rotatedVerts[0].z };
                    const v2 = { x: rotatedVerts[2].x - rotatedVerts[0].x, y: rotatedVerts[2].y - rotatedVerts[0].y, z: rotatedVerts[2].z - rotatedVerts[0].z };
                    const normal = {
                        x: v1.y * v2.z - v1.z * v2.y,
                        y: v1.z * v2.x - v1.x * v2.z,
                        z: v1.x * v2.y - v1.y * v2.x
                    };
                    const len = Math.sqrt(normal.x * normal.x + normal.y * normal.y + normal.z * normal.z);
                    if (len > 0) {
                        normal.x /= len; normal.y /= len; normal.z /= len;
                    }

                    // Project points
                    const projected = rotatedVerts.map(rv => {
                        const scale = (distanceFactor / (distanceFactor + rv.z)) * activeScale;
                        return {
                            x: projectionCenterX + rv.x * scale,
                            y: projectionCenterY + rv.y * scale
                        };
                    });

                    // Calculate average depth
                    const avgZ = rotatedVerts.reduce((acc, rv) => acc + rv.z, 0) / rotatedVerts.length;

                    renderItems.push({
                        type: 'face',
                        colorLabel: 'rear',
                        label: face.label,
                        projected: projected,
                        normal: normal,
                        avgZ: avgZ
                    });
                });

                // 4. Project Pedestal (Stone/Marble) using activePedestal
                activePedestal.faces.forEach(face => {
                    const rotatedVerts = face.indices.map(idx => {
                        const v = activePedestal.vertices[idx];
                        let r = rotateY(v, finalRotY);
                        r = rotateX(r, finalRotX);
                        return r;
                    });

                    // Calculate normal
                    const v1 = { x: rotatedVerts[1].x - rotatedVerts[0].x, y: rotatedVerts[1].y - rotatedVerts[0].y, z: rotatedVerts[1].z - rotatedVerts[0].z };
                    const v2 = { x: rotatedVerts[2].x - rotatedVerts[0].x, y: rotatedVerts[2].y - rotatedVerts[0].y, z: rotatedVerts[2].z - rotatedVerts[0].z };
                    const normal = {
                        x: v1.y * v2.z - v1.z * v2.y,
                        y: v1.z * v2.x - v1.x * v2.z,
                        z: v1.x * v2.y - v1.y * v2.x
                    };
                    const len = Math.sqrt(normal.x * normal.x + normal.y * normal.y + normal.z * normal.z);
                    if (len > 0) {
                        normal.x /= len; normal.y /= len; normal.z /= len;
                    }

                    // Project points
                    const projected = rotatedVerts.map(rv => {
                        const scale = (distanceFactor / (distanceFactor + rv.z)) * activeScale;
                        return {
                            x: projectionCenterX + rv.x * scale,
                            y: projectionCenterY + rv.y * scale
                        };
                    });

                    // Calculate average depth
                    const avgZ = rotatedVerts.reduce((acc, rv) => acc + rv.z, 0) / rotatedVerts.length;

                    renderItems.push({
                        type: 'face',
                        colorLabel: 'stone',
                        label: face.label,
                        projected: projected,
                        normal: normal,
                        avgZ: avgZ
                    });
                });

                // 5. Project Floating Metallic Sphere
                const sphereBasePos = {
                    x: -125,
                    y: 10 + Math.cos(sphereAngle * 0.8) * 12,
                    z: -40
                };
                let spherePos3D = rotateY(sphereBasePos, finalRotY);
                spherePos3D = rotateX(spherePos3D, finalRotX);

                const scale = (distanceFactor / (distanceFactor + spherePos3D.z)) * activeScale;
                const spx = projectionCenterX + spherePos3D.x * scale;
                const spy = projectionCenterY + spherePos3D.y * scale;
                const sRadius = sphereRadius * scale;

                renderItems.push({
                    type: 'sphere',
                    px: spx,
                    py: spy,
                    radius: sRadius,
                    avgZ: spherePos3D.z
                });

                // SORT BY DEPTH (Painter's Algorithm, further away first)
                renderItems.sort((a, b) => b.avgZ - a.avgZ);

                // DRAW ALL ITEMS
                renderItems.forEach(item => {
                    if (item.type === 'face') {
                        // Backface culling: only draw face pointing towards screen (normal.z < 0)
                        if (item.normal.z < 0) {
                            const dot = item.normal.x * light.x + item.normal.y * light.y + item.normal.z * light.z;
                            const shade = Math.max(0, Math.min(1, (dot + 1) / 2));

                            // Find bounds of projected face for gradient sheen
                            let minX = item.projected[0].x, maxX = item.projected[0].x;
                            let minY = item.projected[0].y, maxY = item.projected[0].y;
                            item.projected.forEach(p => {
                                if (p.x < minX) minX = p.x;
                                if (p.x > maxX) maxX = p.x;
                                if (p.y < minY) minY = p.y;
                                if (p.y > maxY) maxY = p.y;
                            });

                            // Custom color palette gradient fills
                            const fillGrad = heroCtx.createLinearGradient(minX, minY, maxX, maxY);
                            if (item.colorLabel === 'rose') {
                                if (isDark) {
                                    fillGrad.addColorStop(0, `rgba(224, 122, 139, ${0.12 + 0.22 * shade})`);
                                    fillGrad.addColorStop(0.5, `rgba(245, 200, 200, ${0.08 + 0.18 * shade})`);
                                    fillGrad.addColorStop(1, `rgba(255, 255, 255, ${0.03 + 0.12 * shade})`);
                                } else {
                                    fillGrad.addColorStop(0, `rgba(240, 184, 184, ${0.12 + 0.22 * shade})`);
                                    fillGrad.addColorStop(0.5, `rgba(199, 95, 113, ${0.12 + 0.25 * shade})`);
                                    fillGrad.addColorStop(1, `rgba(255, 255, 255, ${0.18 + 0.25 * shade})`);
                                }
                            } else if (item.colorLabel === 'sage') {
                                if (isDark) {
                                    fillGrad.addColorStop(0, `rgba(181, 194, 176, ${0.12 + 0.22 * shade})`);
                                    fillGrad.addColorStop(0.5, `rgba(142, 154, 137, ${0.08 + 0.18 * shade})`);
                                    fillGrad.addColorStop(1, `rgba(255, 255, 255, ${0.03 + 0.12 * shade})`);
                                } else {
                                    fillGrad.addColorStop(0, `rgba(162, 174, 157, ${0.12 + 0.22 * shade})`);
                                    fillGrad.addColorStop(0.5, `rgba(218, 224, 215, ${0.08 + 0.18 * shade})`);
                                    fillGrad.addColorStop(1, `rgba(255, 255, 255, ${0.18 + 0.25 * shade})`);
                                }
                            } else if (item.colorLabel === 'rear') {
                                if (isDark) {
                                    fillGrad.addColorStop(0, `rgba(255, 255, 255, ${0.04 + 0.08 * shade})`);
                                    fillGrad.addColorStop(0.5, `rgba(255, 255, 255, ${0.01 + 0.04 * shade})`);
                                    fillGrad.addColorStop(1, `rgba(255, 255, 255, ${0.04 + 0.08 * shade})`);
                                } else {
                                    fillGrad.addColorStop(0, `rgba(255, 255, 255, ${0.1 + 0.15 * shade})`);
                                    fillGrad.addColorStop(0.5, `rgba(255, 255, 255, ${0.05 + 0.08 * shade})`);
                                    fillGrad.addColorStop(1, `rgba(255, 255, 255, ${0.15 + 0.2 * shade})`);
                                }
                            } else if (item.colorLabel === 'stone') {
                                if (isDark) {
                                    fillGrad.addColorStop(0, `rgba(${Math.floor(43 + 30 * shade)}, ${Math.floor(39 + 28 * shade)}, ${Math.floor(36 + 24 * shade)}, 0.98)`);
                                    fillGrad.addColorStop(1, `rgba(${Math.floor(20 + 10 * shade)}, ${Math.floor(18 + 8 * shade)}, ${Math.floor(17 + 6 * shade)}, 0.98)`);
                                } else {
                                    fillGrad.addColorStop(0, `rgba(${Math.floor(234 + 21 * shade)}, ${Math.floor(227 + 19 * shade)}, ${Math.floor(220 + 22 * shade)}, 0.98)`);
                                    fillGrad.addColorStop(1, `rgba(${Math.floor(186 + 20 * shade)}, ${Math.floor(173 + 18 * shade)}, ${Math.floor(160 + 15 * shade)}, 0.98)`);
                                }
                            }

                            heroCtx.beginPath();
                            heroCtx.moveTo(item.projected[0].x, item.projected[0].y);
                            for (let i = 1; i < item.projected.length; i++) {
                                heroCtx.lineTo(item.projected[i].x, item.projected[i].y);
                            }
                            heroCtx.closePath();

                            heroCtx.fillStyle = fillGrad;
                            heroCtx.fill();

                            // Cast ambient contact shadow on the stone pedestal top cap
                            if (item.colorLabel === 'stone' && item.label === 'top') {
                                const centerProj = item.projected.reduce((acc, p) => ({ x: acc.x + p.x, y: acc.y + p.y }), { x: 0, y: 0 });
                                centerProj.x /= item.projected.length;
                                centerProj.y /= item.projected.length;

                                const shadowGrad = heroCtx.createRadialGradient(
                                    centerProj.x, centerProj.y - 3, 5,
                                    centerProj.x, centerProj.y, 85
                                );
                                shadowGrad.addColorStop(0, 'rgba(40, 30, 25, 0.45)');
                                shadowGrad.addColorStop(0.35, 'rgba(40, 30, 25, 0.25)');
                                shadowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

                                heroCtx.fillStyle = shadowGrad;
                                heroCtx.beginPath();
                                heroCtx.ellipse(centerProj.x, centerProj.y, 115, 38, finalRotY * 0.4, 0, Math.PI * 2);
                                heroCtx.fill();
                            }

                            // Specular light sheen rays and bevel borders inside front glass panels
                            if (item.colorLabel !== 'stone' && (item.label === 'front' || item.label === 'back')) {
                                const specGrad = heroCtx.createLinearGradient(minX, minY, maxX, maxY);
                                const rayPos = Math.max(0, Math.min(1, 0.4 + Math.sin(finalRotY * 1.8) * 0.25));
                                specGrad.addColorStop(0, 'rgba(255,255,255,0)');
                                specGrad.addColorStop(Math.max(0, rayPos - 0.08), 'rgba(255,255,255,0)');
                                specGrad.addColorStop(rayPos, 'rgba(255,255,255,0.22)');
                                specGrad.addColorStop(Math.min(1, rayPos + 0.08), 'rgba(255,255,255,0)');
                                specGrad.addColorStop(1, 'rgba(255,255,255,0)');

                                heroCtx.fillStyle = specGrad;
                                heroCtx.beginPath();
                                heroCtx.moveTo(item.projected[0].x, item.projected[0].y);
                                for (let i = 1; i < item.projected.length; i++) {
                                    heroCtx.lineTo(item.projected[i].x, item.projected[i].y);
                                }
                                heroCtx.closePath();
                                heroCtx.fill();

                                // Bevel Highlight (scaled down inner outline)
                                const cx = (minX + maxX) / 2;
                                const cy = (minY + maxY) / 2;
                                const scaleInner = 0.95;
                                heroCtx.beginPath();
                                const p0 = item.projected[0];
                                heroCtx.moveTo(p0.x * scaleInner + cx * (1 - scaleInner), p0.y * scaleInner + cy * (1 - scaleInner));
                                for (let i = 1; i < item.projected.length; i++) {
                                    const p = item.projected[i];
                                    heroCtx.lineTo(p.x * scaleInner + cx * (1 - scaleInner), p.y * scaleInner + cy * (1 - scaleInner));
                                }
                                heroCtx.closePath();
                                heroCtx.strokeStyle = isDark ? 'rgba(255, 255, 255, 0.22)' : 'rgba(255, 255, 255, 0.35)';
                                heroCtx.lineWidth = 0.75;
                                heroCtx.stroke();
                            }

                            // Sharp highlighted glass or stone outline
                            if (item.colorLabel === 'stone') {
                                heroCtx.strokeStyle = isDark 
                                    ? `rgba(244, 239, 235, ${0.03 + 0.07 * shade})` 
                                    : `rgba(84, 70, 58, ${0.05 + 0.1 * shade})`;
                            } else {
                                heroCtx.strokeStyle = isDark 
                                    ? `rgba(255, 255, 255, ${0.08 + 0.22 * shade})` 
                                    : `rgba(23, 23, 25, ${0.06 + 0.14 * shade})`;
                            }
                            heroCtx.lineWidth = item.colorLabel === 'stone' ? 0.8 : 0.95;
                            heroCtx.stroke();
                        }
                    } else if (item.type === 'sphere') {
                        // Draw Polished Silver Metal Sphere
                        const sphereGrad = heroCtx.createRadialGradient(
                            item.px - item.radius * 0.35, item.py - item.radius * 0.35, item.radius * 0.05,
                            item.px, item.py, item.radius
                        );
                        if (isDark) {
                            sphereGrad.addColorStop(0, '#FFFFFF');
                            sphereGrad.addColorStop(0.35, '#9CA3AF');
                            sphereGrad.addColorStop(0.75, '#4B5563');
                            sphereGrad.addColorStop(1, '#1E1E22');
                        } else {
                            sphereGrad.addColorStop(0, '#FFFFFF');
                            sphereGrad.addColorStop(0.3, '#D1D5DB');
                            sphereGrad.addColorStop(0.75, '#6B7280');
                            sphereGrad.addColorStop(1, '#374151');
                        }

                        heroCtx.beginPath();
                        heroCtx.arc(item.px, item.py, item.radius, 0, Math.PI * 2);
                        heroCtx.fillStyle = sphereGrad;
                        heroCtx.fill();

                        // Reflect ambient rose panel light
                        const roseReflect = heroCtx.createRadialGradient(
                            item.px + item.radius * 0.4, item.py + item.radius * 0.2, 0,
                            item.px + item.radius * 0.4, item.py + item.radius * 0.2, item.radius * 0.8
                        );
                        roseReflect.addColorStop(0, 'rgba(240, 184, 184, 0.35)');
                        roseReflect.addColorStop(0.5, 'rgba(199, 95, 113, 0.12)');
                        roseReflect.addColorStop(1, 'rgba(0,0,0,0)');

                        heroCtx.fillStyle = roseReflect;
                        heroCtx.beginPath();
                        heroCtx.arc(item.px, item.py, item.radius, 0, Math.PI * 2);
                        heroCtx.fill();

                        // Reflect ambient sage panel light
                        const sageReflect = heroCtx.createRadialGradient(
                            item.px - item.radius * 0.3, item.py + item.radius * 0.4, 0,
                            item.px - item.radius * 0.3, item.py + item.radius * 0.4, item.radius * 0.7
                        );
                        sageReflect.addColorStop(0, 'rgba(162, 174, 157, 0.25)');
                        sageReflect.addColorStop(0.5, 'rgba(162, 174, 157, 0.06)');
                        sageReflect.addColorStop(1, 'rgba(0,0,0,0)');

                        heroCtx.fillStyle = sageReflect;
                        heroCtx.beginPath();
                        heroCtx.arc(item.px, item.py, item.radius, 0, Math.PI * 2);
                        heroCtx.fill();

                        // Bright white hot-spot highlight
                        const specularHighlight = heroCtx.createRadialGradient(
                            item.px - item.radius * 0.4, item.py - item.radius * 0.4, 0,
                            item.px - item.radius * 0.4, item.py - item.radius * 0.4, item.radius * 0.35
                        );
                        specularHighlight.addColorStop(0, 'rgba(255, 255, 255, 0.85)');
                        specularHighlight.addColorStop(1, 'rgba(255, 255, 255, 0)');

                        heroCtx.fillStyle = specularHighlight;
                        heroCtx.beginPath();
                        heroCtx.arc(item.px, item.py, item.radius, 0, Math.PI * 2);
                        heroCtx.fill();

                        heroCtx.strokeStyle = isDark ? 'rgba(255, 255, 255, 0.18)' : 'rgba(0, 0, 0, 0.14)';
                        heroCtx.lineWidth = 0.8;
                        heroCtx.stroke();
                    }
                });
            }
        }

        requestAnimationFrame(render);
    };

    render();

    // 13. Advanced Word-by-Word Split and Scroll Reveal Observer (Eloqwnt-style)
    const splitTextIntoSpans = (element) => {
        const wrapTextNode = (node) => {
            const text = node.textContent;
            const words = text.split(/(\s+)/);
            const fragment = document.createDocumentFragment();
            
            words.forEach(word => {
                if (word.trim() === '') {
                    fragment.appendChild(document.createTextNode(word));
                } else {
                    const container = document.createElement('span');
                    container.style.display = 'inline-block';
                    container.style.overflow = 'hidden';
                    container.style.verticalAlign = 'bottom';
                    
                    const wordSpan = document.createElement('span');
                    wordSpan.textContent = word;
                    wordSpan.style.display = 'inline-block';
                    wordSpan.classList.add('reveal-word');
                    
                    container.appendChild(wordSpan);
                    fragment.appendChild(container);
                }
            });
            node.parentNode.replaceChild(fragment, node);
        };

        const traverse = (node) => {
            const childNodes = Array.from(node.childNodes);
            childNodes.forEach(child => {
                if (child.nodeType === Node.TEXT_NODE) {
                    wrapTextNode(child);
                } else if (child.nodeType === Node.ELEMENT_NODE && child.tagName !== 'SCRIPT' && !child.classList.contains('reveal-word')) {
                    traverse(child);
                }
            });
        };
        
        traverse(element);
    };

    // Initialize text splits for headings
    const textRevealElements = document.querySelectorAll('.hero h1, .section-title h2, .about-left h2, .contact-info h2');
    textRevealElements.forEach(el => splitTextIntoSpans(el));

    // Combine all elements to observe
    const revealElements = document.querySelectorAll('.reveal, .reveal-stagger, .hero h1, .section-title h2, .about-left h2, .contact-info h2, .hero-canvas, #hero-canvas, .service-card-visual, .about-right');

    if (!window.IntersectionObserver) {
        // Fallback: immediately show everything
        revealElements.forEach(el => {
            el.classList.add('revealed');
            const words = el.querySelectorAll('.reveal-word');
            words.forEach(w => {
                w.style.transform = 'translateY(0)';
                w.style.opacity = '1';
            });
        });
    } else {
        const revealOptions = {
            root: null,
            threshold: 0.05,
            rootMargin: '0px 0px -40px 0px'
        };

        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    el.classList.add('revealed');
                    
                    // Trigger word reveal if it's a split text element
                    const words = el.querySelectorAll('.reveal-word');
                    if (words.length > 0) {
                        words.forEach((word, idx) => {
                            word.style.transition = 'transform 0.9s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.9s ease';
                            word.style.transitionDelay = `${idx * 25}ms`;
                            requestAnimationFrame(() => {
                                word.style.transform = 'translateY(0)';
                                word.style.opacity = '1';
                            });
                        });
                    }

                    // Trigger staggered fade-in for list/grid children
                    if (el.classList.contains('reveal-stagger')) {
                        const children = el.children;
                        Array.from(children).forEach((child, index) => {
                            child.style.transitionDelay = `${index * 0.08}s`;
                            child.classList.add('revealed');
                        });
                    }
                    
                    observer.unobserve(el);
                }
            });
        }, revealOptions);

        revealElements.forEach(el => revealObserver.observe(el));
    }

    // 16. Scroll Parallax for Foliage Elements (Depth-of-field movement)
    let lastScrollY = window.scrollY;
    let ticking = false;

    const updateParallax = () => {
        const scrolled = window.scrollY;
        const foliageLeft = document.querySelector('.foliage-left');
        const foliageRight = document.querySelector('.foliage-right');
        const foliageFgLeft = document.querySelector('.foliage-fg-left');
        const foliageFgRight = document.querySelector('.foliage-fg-right');
        
        if (foliageLeft) foliageLeft.style.transform = `rotate(15deg) translateY(${scrolled * 0.08}px)`;
        if (foliageRight) foliageRight.style.transform = `rotate(-30deg) translateY(${-scrolled * 0.06}px)`;
        if (foliageFgLeft) foliageFgLeft.style.transform = `rotate(45deg) translateY(${scrolled * 0.18}px)`;
        if (foliageFgRight) foliageFgRight.style.transform = `rotate(-15deg) translateY(${-scrolled * 0.14}px)`;
        
        ticking = false;
    };

    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(updateParallax);
            ticking = true;
        }
    });
    // Trigger initially
    updateParallax();

    // 14. Form Submission Handling via Fetch has been removed and moved to the end of the file.

    // 15. Process Card Detail Overlay Toggle
    const processCards = document.querySelectorAll('.process-card');
    processCards.forEach(card => {
        const arrowBtn = card.querySelector('.process-arrow-btn');
        const closeBtn = card.querySelector('.close-overlay-btn');
        
        const openDetail = (e) => {
            if (e) e.stopPropagation();
            // Close any other open process card details first
            processCards.forEach(otherCard => {
                if (otherCard !== card) {
                    otherCard.classList.remove('detail-active');
                }
            });
            card.classList.add('detail-active');
        };

        const closeDetail = (e) => {
            if (e) e.stopPropagation();
            card.classList.remove('detail-active');
        };

        if (arrowBtn) {
            arrowBtn.addEventListener('click', openDetail);
            arrowBtn.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    openDetail(e);
                }
            });
        }
        
        if (closeBtn) {
            closeBtn.addEventListener('click', closeDetail);
            closeBtn.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    closeDetail(e);
                }
            });
        }
    });

    // Close process card details if clicking outside the card
    document.addEventListener('click', (e) => {
        processCards.forEach(card => {
            if (card.classList.contains('detail-active') && !card.contains(e.target)) {
                card.classList.remove('detail-active');
            }
        });
    });

    // 17. Custom Cursor Inertia Follower (Eloqwnt-style)
    const cursorArea = document.querySelector('.custom-cursor-area');
    const cursorDot = document.querySelector('.custom-cursor-dot');
    const cursorRing = document.querySelector('.custom-cursor-ring');
    
    if (cursorArea && cursorDot && cursorRing) {
        let mouseX = 0, mouseY = 0;
        let dotX = 0, dotY = 0;
        let ringX = 0, ringY = 0;
        let hasMoved = false;
        
        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            cursorArea.style.opacity = '1';
            if (!hasMoved) {
                hasMoved = true;
                dotX = mouseX;
                dotY = mouseY;
                ringX = mouseX;
                ringY = mouseY;
            }
        });

        document.addEventListener('mouseleave', () => {
            cursorArea.style.opacity = '0';
        });
        
        const updateCursor = () => {
            // Linear interpolation (Lerp) for smooth lag delay
            dotX += (mouseX - dotX) * 0.32;
            dotY += (mouseY - dotY) * 0.32;
            ringX += (mouseX - ringX) * 0.12;
            ringY += (mouseY - ringY) * 0.12;
            
            cursorDot.style.left = `${dotX}px`;
            cursorDot.style.top = `${dotY}px`;
            cursorRing.style.left = `${ringX}px`;
            cursorRing.style.top = `${ringY}px`;
            
            requestAnimationFrame(updateCursor);
        };
        updateCursor();
        
        // Bind hover states for interactive assets
        const refreshHoverables = () => {
            const hoverables = document.querySelectorAll('a, button, select, input, textarea, [role="button"], .theme-toggle, .close-overlay-btn, .process-arrow-btn');
            hoverables.forEach(item => {
                item.addEventListener('mouseenter', () => {
                    cursorArea.classList.add('hovered');
                });
                item.addEventListener('mouseleave', () => {
                    cursorArea.classList.remove('hovered');
                });
            });
        };
        refreshHoverables();
        // Fallback re-hook triggers on state shifts
        document.addEventListener('mouseover', (e) => {
            if (e.target.closest('a, button, select, input, textarea, [role="button"], .theme-toggle, .close-overlay-btn, .process-arrow-btn')) {
                cursorArea.classList.add('hovered');
            } else {
                cursorArea.classList.remove('hovered');
            }
        });
    }

    // 18. Magnetic Button Hover Effect
    const magneticBtns = document.querySelectorAll('.btn-primary, .btn-secondary, .theme-toggle, .process-arrow-btn, .close-overlay-btn');
    magneticBtns.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            // Move item 25% closer towards mouse offset
            btn.style.transform = `translate(${x * 0.25}px, ${y * 0.25}px)`;
        });
        
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = '';
        });
    });
};

// Defensive Initialization trigger check
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// Contact Form Handler (Resend Integration)
document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contact-form');
    const formSuccess = document.getElementById('form-success');
    const submitBtn = contactForm ? contactForm.querySelector('button[type="submit"]') : null;

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.textContent = 'Sending...';
            }

            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData.entries());

            try {
                const response = await fetch('/api/contact', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });

                const result = await response.json();

                if (response.ok) {
                    if (formSuccess) {
                        formSuccess.classList.add('active');
                        // Close success overlay listener
                        const closeOverlayBtn = document.getElementById('success-close');
                        if (closeOverlayBtn) {
                            closeOverlayBtn.addEventListener('click', () => {
                                formSuccess.classList.remove('active');
                            }, { once: true });
                        }
                    } else {
                        alert('Message sent successfully!');
                    }
                    contactForm.reset();
                } else {
                    alert('Error sending message: ' + (result.error || 'Please try again.'));
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Network error: Could not send message.');
            } finally {
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Send Message';
                }
            }
        });
    }
});
