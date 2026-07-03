document.addEventListener('DOMContentLoaded', () => {
    // 1. Dynamic Cursor Spotlight Effect
    const spotlight = document.createElement('div');
    spotlight.className = 'spotlight-bg';
    document.body.appendChild(spotlight);

    window.addEventListener('mousemove', (e) => {
        document.documentElement.style.setProperty('--mouse-x', `${e.clientX}px`);
        document.documentElement.style.setProperty('--mouse-y', `${e.clientY}px`);
    });

    // 2. Typing Effect (Hero Headline)
    const strings = [
        "Aspiring Computer Science Engineer",
        "AI Agents Enthusiast",
        "Asset Management System Developer",
        "Top 10 Intern - Lynkube Summit"
    ];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const typingSpan = document.getElementById('typing-text');
    
    function typeEffect() {
        if (!typingSpan) return;
        const currentWord = strings[wordIndex];
        
        if (isDeleting) {
            typingSpan.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typingSpan.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
        }
        
        let typeSpeed = isDeleting ? 30 : 60;
        
        if (!isDeleting && charIndex === currentWord.length) {
            typeSpeed = 2000; // Hold word
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % strings.length;
            typeSpeed = 500; // Pause before typing next word
        }
        
        setTimeout(typeEffect, typeSpeed);
    }
    
    setTimeout(typeEffect, 1000);

    // 3. Navigation Scroll Effect
    const header = document.querySelector('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // 4. Reveal on Scroll (Intersection Observer)
    const revealElements = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    revealElements.forEach(el => observer.observe(el));

    // 5. Skills Grid Filter
    const tabBtns = document.querySelectorAll('.tab-btn');
    const skillCards = document.querySelectorAll('.skill-card');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const filter = btn.dataset.filter;
            
            skillCards.forEach(card => {
                if (filter === 'all' || card.dataset.category === filter) {
                    card.style.display = 'flex';
                    // Trigger reflow/animation
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(15px)';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 50);
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // 6. Resume Timeline Toggle (Experience vs. Education)
    const timelineBtnExp = document.getElementById('btn-experience');
    const timelineBtnEdu = document.getElementById('btn-education');
    const timelineItems = document.querySelectorAll('.timeline-item');

    function filterTimeline(type) {
        timelineItems.forEach(item => {
            if (item.dataset.type === type) {
                item.style.display = 'block';
                item.style.opacity = '0';
                item.style.transform = 'translateY(15px)';
                setTimeout(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'translateY(0)';
                }, 50);
            } else {
                item.style.display = 'none';
            }
        });
    }

    if (timelineBtnExp && timelineBtnEdu) {
        timelineBtnExp.addEventListener('click', () => {
            timelineBtnExp.classList.add('active');
            timelineBtnEdu.classList.remove('active');
            filterTimeline('experience');
        });

        timelineBtnEdu.addEventListener('click', () => {
            timelineBtnEdu.classList.add('active');
            timelineBtnExp.classList.remove('active');
            filterTimeline('education');
        });

        // Initial load: experience
        filterTimeline('experience');
    }

    // 7. Interactive Chess Mini-Puzzle (Easter Egg!)
    // "White to play: Find the Backrank Mate in 1"
    const chessBoardElement = document.getElementById('chess-board');
    const chessStatusElement = document.getElementById('chess-status');
    const chessResetBtn = document.getElementById('chess-reset-btn');
    
    // Initial chess board state (8x8 grid)
    // Row 0 is Rank 8, Row 7 is Rank 1
    // Col 0 is A, Col 7 is H
    // Empty cells = '', pieces: ♔/♕/♖/etc.
    let boardState = Array(8).fill(null).map(() => Array(8).fill(''));
    let selectedSquare = null;
    let puzzleSolved = false;

    function resetChessPuzzle() {
        selectedSquare = null;
        puzzleSolved = false;
        if (chessStatusElement) {
            chessStatusElement.textContent = "White to play: Move White Rook (♖) to deliver checkmate!";
            chessStatusElement.style.color = "var(--secondary)";
        }
        
        // Reset board grid
        boardState = Array(8).fill(null).map(() => Array(8).fill(''));
        
        // Setup puzzle state
        // Black King (♚) on h8 (row 0, col 7)
        boardState[0][7] = '♚';
        // Black Pawns (♟) on f7 (row 1, col 5), g7 (row 1, col 6), h7 (row 1, col 7)
        boardState[1][5] = '♟';
        boardState[1][6] = '♟';
        boardState[1][7] = '♟';
        
        // White Rook (♖) on d1 (row 7, col 3)
        boardState[7][3] = '♖';
        // White King (♔) on g1 (row 7, col 6)
        boardState[7][6] = '♔';
        // White Pawns (♙) on f2 (row 6, col 5), g2 (row 6, col 6), h2 (row 6, col 7)
        boardState[6][5] = '♙';
        boardState[6][6] = '♙';
        boardState[6][7] = '♙';
        
        renderChessBoard();
    }

    function renderChessBoard() {
        if (!chessBoardElement) return;
        chessBoardElement.innerHTML = '';
        
        for (let r = 0; r < 8; r++) {
            for (let c = 0; c < 8; c++) {
                const cell = document.createElement('div');
                const isLight = (r + c) % 2 === 0;
                cell.className = `chess-cell ${isLight ? 'light' : 'dark'}`;
                cell.dataset.row = r;
                cell.dataset.col = c;
                
                // Add piece text
                cell.textContent = boardState[r][c];
                
                // Styling pieces
                if (boardState[r][c] !== '') {
                    const isWhitePiece = ['♖', '♔', '♙'].includes(boardState[r][c]);
                    cell.style.color = isWhitePiece ? '#4f46e5' : '#1e293b';
                    cell.style.fontWeight = 'bold';
                }
                
                // Highlight selection
                if (selectedSquare && selectedSquare.row === r && selectedSquare.col === c) {
                    cell.classList.add('highlight');
                }
                
                // Highlight winning target if puzzle solved
                if (puzzleSolved && r === 0 && c === 3) {
                    cell.classList.add('checkmate');
                }
                
                // Handle square clicks
                cell.addEventListener('click', () => handleChessSquareClick(r, c));
                
                chessBoardElement.appendChild(cell);
            }
        }
    }

    function handleChessSquareClick(r, c) {
        if (puzzleSolved) return;
        
        const clickedPiece = boardState[r][c];
        
        // White pieces: ♖, ♔, ♙. Only White Rook (♖) is allowed to move for solving the puzzle.
        if (clickedPiece === '♖') {
            selectedSquare = { row: r, col: c };
            chessStatusElement.textContent = "Rook selected! Click the destination square (d8) to deliver checkmate.";
            renderChessBoard();
        } else if (selectedSquare) {
            // Check if destination is correct (Row 0, Col 3 -> d8)
            if (selectedSquare.row === 7 && selectedSquare.col === 3 && r === 0 && c === 3) {
                // Move the Rook
                boardState[7][3] = '';
                boardState[0][3] = '♖';
                puzzleSolved = true;
                selectedSquare = null;
                
                chessStatusElement.textContent = "🎉 Checkmate! You solved the puzzle. Aaditya is a certified chess enthusiast (UP State Rating Certificate holder)!";
                chessStatusElement.style.color = "#10b981";
                renderChessBoard();
            } else {
                // Invalid move / wrong puzzle move
                selectedSquare = null;
                chessStatusElement.textContent = "That's not the checkmate move! Try moving the Rook to the back rank (d8).";
                chessStatusElement.style.color = "#ef4444";
                renderChessBoard();
            }
        } else {
            chessStatusElement.textContent = "Select White's Rook (♖) on d1 to start your move!";
            chessStatusElement.style.color = "var(--secondary)";
        }
    }

    if (chessResetBtn) {
        chessResetBtn.addEventListener('click', resetChessPuzzle);
    }
    
    // Initialize Chess Puzzle
    resetChessPuzzle();

    // 8. Contact Form Handling
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');
    
    // EmailJS credentials
    const EMAILJS_PUBLIC_KEY = 'HtOMoyXBpJ2IzsJOn';
    const EMAILJS_SERVICE_ID = 'service_rsq94vn';
    const EMAILJS_TEMPLATE_ID = 'template_sloqu3g';


    if (contactForm && formStatus) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const name = document.getElementById('form-name').value;
            const email = document.getElementById('form-email').value;
            const msg = document.getElementById('form-message').value;
            
            if (!name || !email || !msg) {
                formStatus.textContent = "Please fill in all required fields.";
                formStatus.className = "form-status error";
                return;
            }
            
            // Check if user has set up their credentials
            if (!EMAILJS_PUBLIC_KEY || EMAILJS_PUBLIC_KEY === 'YOUR_PUBLIC_KEY_PLACEHOLDER') {
                formStatus.textContent = "Configuration error: EmailJS keys are not set up yet.";
                formStatus.className = "form-status error";
                return;
            }
            
            formStatus.textContent = "Sending message...";
            formStatus.className = "form-status info";
            
            // Initialize EmailJS
            emailjs.init({
                publicKey: EMAILJS_PUBLIC_KEY,
            });

            const templateParams = {
        from_name: name,
        reply_to: email,
        from_email: email,
        message: msg
};

            emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams)
                .then(() => {
                    formStatus.textContent = `Thank you, ${name}! Your message has been sent successfully.`;
                    formStatus.className = "form-status success";
                    contactForm.reset();
                })
                .catch((error) => {
                    console.error("EmailJS Error:", error);
                    formStatus.textContent = "Failed to send message. Please check connection or try again later.";
                    formStatus.className = "form-status error";
                });
        });
    }

    // 9. Back to Top Button
    const scrollTopBtn = document.getElementById('scroll-top-btn');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            scrollTopBtn.classList.add('show');
        } else {
            scrollTopBtn.classList.remove('show');
        }
    });

    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // 10. Mobile Menu Logic (Basic placeholder toggle for smaller screens)
    const mobileToggle = document.getElementById('mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileToggle && navLinks) {
        mobileToggle.addEventListener('click', () => {
            if (navLinks.style.display === 'flex') {
                navLinks.style.display = 'none';
            } else {
                navLinks.style.display = 'flex';
                navLinks.style.flexDirection = 'column';
                navLinks.style.position = 'absolute';
                navLinks.style.top = '100%';
                navLinks.style.left = '0';
                navLinks.style.width = '100%';
                navLinks.style.background = 'var(--bg-dark)';
                navLinks.style.padding = '2rem';
                navLinks.style.borderBottom = '1px solid var(--border-color)';
                navLinks.style.alignItems = 'center';
                navLinks.style.gap = '1.5rem';
                navLinks.style.zIndex = '999';
            }
        });
        
        // Close menu on link click
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 768) {
                    navLinks.style.display = 'none';
                }
            });
        });
    }
});
