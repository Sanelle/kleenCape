document.addEventListener('DOMContentLoaded', function() {
  // Preloader
  setTimeout(() => {
    document.querySelector('.preloader').classList.add('fade-out');
    setTimeout(() => {
      document.querySelector('.preloader').style.display = 'none';
    }, 500);
  }, 1500);

  // Mobile Menu Toggle
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');
  
  hamburger.addEventListener('click', function() {
    const isExpanded = this.getAttribute('aria-expanded') === 'true';
    this.setAttribute('aria-expanded', !isExpanded);
    navLinks.classList.toggle('active');
    
    if (!isExpanded) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  });

  // Smooth Scrolling for Anchor Links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 80,
          behavior: 'smooth'
        });
        
        // Close mobile menu if open
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
      }
    });
  });

  // Vendor Filtering
  const filterButtons = document.querySelectorAll('.filter-btn');
  const vendorCards = document.querySelectorAll('.vendor-card');
  
  filterButtons.forEach(button => {
    button.addEventListener('click', function() {
      const filter = this.dataset.filter;
      
      // Update active state
      filterButtons.forEach(btn => btn.classList.remove('active'));
      this.classList.add('active');
      
      // Filter vendors
      vendorCards.forEach(card => {
        if (filter === 'all' || card.dataset.category === filter) {
          card.style.display = 'block';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 10);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 300);
        }
      });
    });
  });

  // Testimonial Slider
  const testimonialCards = document.querySelectorAll('.testimonial-card');
  const sliderPrev = document.querySelector('.slider-prev');
  const sliderNext = document.querySelector('.slider-next');
  const sliderDots = document.querySelectorAll('.dot');
  let currentTestimonial = 0;

  function showTestimonial(index) {
    testimonialCards.forEach(card => card.classList.remove('active'));
    sliderDots.forEach(dot => dot.classList.remove('active'));
    
    testimonialCards[index].classList.add('active');
    sliderDots[index].classList.add('active');
    currentTestimonial = index;
  }

  if (sliderPrev) {
    sliderPrev.addEventListener('click', () => {
      let newIndex = currentTestimonial - 1;
      if (newIndex < 0) newIndex = testimonialCards.length - 1;
      showTestimonial(newIndex);
    });
  }

  if (sliderNext) {
    sliderNext.addEventListener('click', () => {
      let newIndex = currentTestimonial + 1;
      if (newIndex >= testimonialCards.length) newIndex = 0;
      showTestimonial(newIndex);
    });
  }

  sliderDots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      showTestimonial(index);
    });
  });

  // Auto-rotate testimonials
  setInterval(() => {
    let newIndex = currentTestimonial + 1;
    if (newIndex >= testimonialCards.length) newIndex = 0;
    showTestimonial(newIndex);
  }, 5000);

  // Modal Handling
  window.openModal = function(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  };

  window.closeModal = function(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  };

  // Close modal when clicking outside
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', function() {
      const modal = this.closest('.modal');
      if (modal) {
        closeModal(modal.id);
      }
    });
  });

  // Auth Modal Handling
  let currentUserType = 'user'; // 'user' or 'vendor'
  
  window.openAuthModal = function(mode, userType) {
    currentUserType = userType || 'user';
    toggleAuthMode(mode);
    switchAuthType(currentUserType);
    openModal('authModal');
  };

  window.closeAuthModal = function() {
    closeModal('authModal');
  };

  window.toggleAuthMode = function(mode) {
    const formToggleButtons = document.querySelectorAll('.form-toggle button');
    const authSubmitText = document.getElementById('authSubmitText');
    const authToggleText = document.getElementById('authToggleText');
    const signupFields = document.getElementById('signupFields');
    
    formToggleButtons.forEach(btn => btn.classList.remove('active'));
    formToggleButtons.forEach(btn => {
      if (btn.getAttribute('onclick').includes(mode)) {
        btn.classList.add('active');
      }
    });
    
    if (mode === 'login') {
      signupFields.style.display = 'none';
      document.getElementById('authSubmitText').textContent = 'Login';
      document.getElementById('authModalTitle').innerHTML = currentUserType === 'vendor' 
        ? '<i class="fas fa-store"></i> Vendor Login' 
        : '<i class="fas fa-sign-in-alt"></i> Login';
      document.getElementById('authToggleText').innerHTML = `Don't have an account? <a href="#" onclick="toggleAuthForm('signup', currentUserType || 'user')">Sign up</a>`;
    } else {
      signupFields.style.display = 'block';
      document.getElementById('authSubmitText').textContent = 'Sign Up';
      document.getElementById('authModalTitle').innerHTML = currentUserType === 'vendor' 
        ? '<i class="fas fa-store"></i> Vendor Sign Up' 
        : '<i class="fas fa-user-plus"></i> Sign Up';
      document.getElementById('authToggleText').innerHTML = `Already have an account? <a href="#" onclick="toggleAuthForm('login', currentUserType || 'user')">Login</a>`;
    }
    
    toggleAuthForm(mode, currentUserType);
  };

  window.switchAuthType = function(userType) {
    currentUserType = userType;
    const authTabs = document.querySelectorAll('.auth-tabs button');
    
    authTabs.forEach(tab => tab.classList.remove('active'));
    authTabs.forEach(tab => {
      if (tab.getAttribute('onclick').includes(userType)) {
        tab.classList.add('active');
      }
    });
    
    // Refresh the current auth mode
    const currentMode = document.querySelector('.form-toggle button.active').textContent.toLowerCase().trim();
    toggleAuthMode(currentMode);
  };

  function toggleAuthForm(mode, type) {
    const vendorSignupFields = document.getElementById('vendorSignupFields');
    if (mode === 'signup' && type === 'vendor') {
      vendorSignupFields.style.display = 'block';
    } else if (mode === 'signup') {
      vendorSignupFields.style.display = 'none';
    }
  }

  // Toggle password visibility
  const passwordToggle = document.querySelector('.password-toggle');
  if (passwordToggle) {
    passwordToggle.addEventListener('click', function() {
      const passwordInput = document.getElementById('authPassword');
      const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
      passwordInput.setAttribute('type', type);
      this.innerHTML = type === 'password' ? '<i class="fas fa-eye"></i>' : '<i class="fas fa-eye-slash"></i>';
    });
  }

  // Demo Login
  window.demoLogin = function(type) {
    const authButtons = document.getElementById('authButtons');
    const userMenu = document.getElementById('userMenu');
    const loggedinFooter = document.querySelector('.loggedin-footer');
    
    if (type === 'user') {
      // Set demo user data
      currentUser = {
        id: 'user123',
        name: 'Sarah Johnson',
        email: 'demo@user.com',
        phone: '+27 83 456 7890',
        address: '12 Kloof Street, Gardens, Cape Town',
        avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
        type: 'user',
        memberSince: 'June 2023'
      };
      
      updateAuthUI();
      closeAuthModal();
    } else if (type === 'vendor') {
      // Set demo vendor data
      currentUser = {
        id: 'vendor123',
        name: 'Demo Vendor',
        companyName: 'CleanPro Services',
        email: 'demo@vendor.com',
        phone: '+27 76 123 4567',
        description: 'Professional cleaning service with 5 years experience in Cape Town',
        services: ['Home Cleaning', 'Office Cleaning'],
        areas: ['City Bowl', 'Atlantic Seaboard'],
        avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
        type: 'vendor',
        memberSince: 'January 2023',
        rating: 4.9,
        jobs: 24,
        earnings: 'R18,450'
      };
      
      updateAuthUI();
      closeAuthModal();
    }
  };

  let currentUser = null;

  window.logout = function() {
    currentUser = null;
    updateAuthUI();
  };

  function updateAuthUI() {
    const authButtons = document.getElementById('authButtons');
    const userMenu = document.getElementById('userMenu');
    const loggedinFooter = document.querySelector('.loggedin-footer');
    const userFooterMenu = document.querySelector('.footer-menu.user-menu');
    const vendorFooterMenu = document.querySelector('.footer-menu.vendor-menu');
    const mainFooter = document.querySelector('footer');
    
    if (currentUser) {
      // Hide auth buttons
      authButtons.style.display = 'none';
      
      // Show user menu
      userMenu.style.display = 'flex';
      
      // Update user info
      document.getElementById('userGreeting').textContent = `Welcome, ${currentUser.name.split(' ')[0]}`;
      document.getElementById('userAvatar').src = currentUser.avatar;
      
      // Show appropriate dashboard
      if (currentUser.type === 'user') {
        document.getElementById('userDashboard').style.display = 'block';
        document.getElementById('vendorDashboard').style.display = 'none';
        
        // Update user dashboard
        document.getElementById('dashboardUserName').innerHTML = `Welcome back, <strong>${currentUser.name}</strong>!`;
        document.getElementById('dashboardUserAvatar').src = currentUser.avatar;
        document.querySelector('.member-since').textContent = `Member since ${currentUser.memberSince}`;
        
        // Populate user profile form
        if (document.getElementById('userProfileForm')) {
          document.getElementById('userName').value = currentUser.name;
          document.getElementById('userPhone').value = currentUser.phone;
          document.getElementById('userEmail').value = currentUser.email;
          document.getElementById('userAddress').value = currentUser.address || '';
          document.getElementById('userAvatarPreview').src = currentUser.avatar;
        }
      } else {
        document.getElementById('userDashboard').style.display = 'none';
        document.getElementById('vendorDashboard').style.display = 'block';
        
        // Update vendor dashboard
        document.getElementById('dashboardVendorName').innerHTML = `Welcome back, <strong>${currentUser.companyName}</strong>!`;
        document.getElementById('dashboardVendorAvatar').src = currentUser.avatar;
        document.querySelector('.member-since').textContent = `Member since ${currentUser.memberSince}`;
        
        // Update stats
        document.querySelectorAll('.stat-value')[0].textContent = currentUser.jobs;
        document.querySelectorAll('.stat-value')[1].textContent = currentUser.rating;
        document.querySelectorAll('.stat-value')[2].textContent = currentUser.earnings;
      }
      
      // Show logged in footer menu
      loggedinFooter.style.display = 'block';
      mainFooter.style.display = 'none';
      
      if (currentUser.type === 'user') {
        userFooterMenu.style.display = 'flex';
        vendorFooterMenu.style.display = 'none';
      } else {
        userFooterMenu.style.display = 'none';
        vendorFooterMenu.style.display = 'flex';
      }
    } else {
      // Show auth buttons
      authButtons.style.display = 'flex';
      
      // Hide user menu
      userMenu.style.display = 'none';
      
      // Hide dashboards
      document.getElementById('userDashboard').style.display = 'none';
      document.getElementById('vendorDashboard').style.display = 'none';
      
      // Show main footer
      loggedinFooter.style.display = 'none';
      mainFooter.style.display = 'block';
    }
  }

  // Show user profile
  window.showUserProfile = function() {
    openModal('userProfileModal');
  };

  // Show vendor profile
  window.showVendorProfile = function() {
    document.getElementById('vendorProfileUpdate').scrollIntoView({
      behavior: 'smooth'
    });
  };

  // Show payment section
  window.showPaymentSection = function() {
    openModal('paymentModal');
  };

  // Show services
  window.showServices = function() {
    document.querySelector('.services-tags').scrollIntoView({
      behavior: 'smooth',
      block: 'center'
    });
  };

  // Toggle payment form
  window.togglePaymentForm = function() {
    const paymentMethods = document.querySelector('.payment-methods');
    const paymentForm = document.getElementById('paymentForm');
    const addPaymentBtn = document.querySelector('.add-payment-btn');
    
    if (paymentForm.style.display === 'block') {
      paymentForm.style.display = 'none';
      addPaymentBtn.style.display = 'block';
      paymentMethods.style.display = 'flex';
    } else {
      paymentForm.style.display = 'block';
      addPaymentBtn.style.display = 'none';
      paymentMethods.style.display = 'none';
      paymentForm.reset();
    }
  };

  // Tab Navigation
  window.showTab = function(tabId) {
    // Hide all tab contents
    document.querySelectorAll('.tab-content').forEach(content => {
      content.classList.remove('active');
    });
    
    // Deactivate all tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.classList.remove('active');
    });
    
    // Show selected tab content
    document.getElementById(tabId).classList.add('active');
    
    // Activate clicked tab button
    event.currentTarget.classList.add('active');
    
    // Update current tab
    if (tabId.startsWith('user-')) {
      currentTab = tabId;
    } else if (tabId.startsWith('vendor-')) {
      currentVendorTab = tabId;
    }
    
    // Update footer menu active state
    updateFooterMenuActiveState();
  };

  let currentTab = 'user-all';
  let currentVendorTab = 'vendor-all';

  function updateFooterMenuActiveState() {
    const activeTab = currentUser?.type === 'vendor' ? currentVendorTab : currentTab;
    
    // User footer menu
    const userButtons = document.querySelectorAll('.footer-menu.user-menu button');
    userButtons.forEach(button => button.classList.remove('active'));
    
    userButtons.forEach(button => {
      if (button.getAttribute('onclick').includes(activeTab)) {
        button.classList.add('active');
      }
    });
    
    // Vendor footer menu
    const vendorButtons = document.querySelectorAll('.footer-menu.vendor-menu button');
    vendorButtons.forEach(button => button.classList.remove('active'));
    
    vendorButtons.forEach(button => {
      if (button.getAttribute('onclick').includes(activeTab)) {
        button.classList.add('active');
      }
    });
  }

  // Back to Top Button
  const backToTopBtn = document.querySelector('.back-to-top');
  const nav = document.querySelector('.sticky-nav');
  
  window.addEventListener('scroll', function() {
    if (window.pageYOffset > 300) {
      backToTopBtn.classList.add('visible');
      nav.classList.add('scrolled');
    } else {
      backToTopBtn.classList.remove('visible');
      nav.classList.remove('scrolled');
    }
  });
  
  backToTopBtn.addEventListener('click', function() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  // Animate stats counting
  function animateStats() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    statNumbers.forEach(stat => {
      const target = parseInt(stat.getAttribute('data-count'));
      const suffix = stat.textContent.includes('%') ? '%' : '';
      let count = 0;
      const duration = 2000;
      const increment = target / (duration / 16);
      
      const updateCount = () => {
        count += increment;
        if (count < target) {
          stat.textContent = Math.floor(count) + suffix;
          setTimeout(updateCount, 16);
        } else {
          stat.textContent = target + suffix;
        }
      };
      
      updateCount();
    });
  }

  // Initialize stats animation when stats section is visible
  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateStats();
        statsObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  const statsSection = document.querySelector('.hero-stats');
  if (statsSection) {
    statsObserver.observe(statsSection);
  }

  // Form Submissions
  const authForm = document.getElementById('authForm');
  if (authForm) {
    authForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const email = document.getElementById('authEmail').value;
      const password = document.getElementById('authPassword').value;
      const isLogin = document.getElementById('authSubmitText').textContent === 'Login';
      
      if (!email || !password) {
        alert('Please fill in all fields');
        return;
      }
      
      if (isLogin) {
        // Login logic
        loginUser(email, password);
      } else {
        // Signup logic
        const name = document.getElementById('authName')?.value;
        
        if (currentUserType === 'vendor') {
          const companyName = document.getElementById('companyName').value;
          const phone = document.getElementById('phoneNumber').value;
          
          if (!name || !companyName || !phone) {
            alert('Please fill in all fields');
            return;
          }
          
          signupVendor(email, password, name, companyName, phone);
        } else {
          if (!name) {
            alert('Please fill in all fields');
            return;
          }
          
          signupUser(email, password, name);
        }
      }
    });
  }

  function loginUser(email, password) {
    // Simulate API call
    setTimeout(() => {
      currentUser = {
        id: 'user123',
        name: 'Sarah Johnson',
        email,
        phone: '+27 83 456 7890',
        address: '12 Kloof Street, Gardens, Cape Town',
        avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
        type: 'user',
        memberSince: 'June 2023'
      };
      
      updateAuthUI();
      closeAuthModal();
      alert(`Welcome back, ${currentUser.name.split(' ')[0]}!`);
    }, 1000);
  }

  function signupUser(email, password, name) {
    // Simulate API call
    setTimeout(() => {
      currentUser = {
        id: 'newuser123',
        name,
        email,
        phone: '',
        address: '',
        avatar: 'https://randomuser.me/api/portraits/women/65.jpg',
        type: 'user',
        memberSince: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
      };
      
      updateAuthUI();
      closeAuthModal();
      alert(`Welcome to CleanCape, ${name.split(' ')[0]}! Your account has been created.`);
    }, 1000);
  }

  function signupVendor(email, password, name, companyName, phone) {
    // Simulate API call
    setTimeout(() => {
      currentUser = {
        id: 'vendor123',
        name,
        companyName,
        email,
        phone,
        description: 'Professional cleaning service',
        services: ['Home Cleaning', 'Office Cleaning'],
        areas: ['City Bowl', 'Atlantic Seaboard'],
        avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
        type: 'vendor',
        memberSince: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
        rating: 4.9,
        jobs: 24,
        earnings: 'R18,450'
      };
      
      updateAuthUI();
      closeAuthModal();
      alert(`Welcome to CleanCape, ${companyName}! Your vendor account has been created.`);
    }, 1000);
  }

  const bookingForm = document.getElementById('bookingForm');
  if (bookingForm) {
    bookingForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const service = document.getElementById('bookingTitle').value;
      const date = document.getElementById('date').value;
      const time = document.getElementById('time').value;
      const size = document.getElementById('propertySize').value;
      const details = document.getElementById('details').value;
      
      if (!service || !date || !time || !size) {
        alert('Please fill in all required fields');
        return;
      }
      
      // Create booking object
      const booking = {
        service,
        date,
        time,
        size,
        details,
        status: 'upcoming',
        vendor: 'CleanPro Services',
        price: 'R500'
      };
      
      // Show booking confirmation
      showBookingConfirmation(booking);
      
      // Close modal
      closeModal('bookingModal');
    });
  }

  function showBookingConfirmation(booking) {
    // Format date
    const bookingDate = new Date(booking.date);
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = bookingDate.toLocaleDateString('en-US', options);
    
    // Create confirmation content
    const content = `
      <div class="booking-details">
        <div class="detail-item">
          <i class="fas fa-broom"></i>
          <div>
            <h4>Service</h4>
            <p>${booking.service}</p>
          </div>
        </div>
        <div class="detail-item">
          <i class="fas fa-calendar-day"></i>
          <div>
            <h4>Date & Time</h4>
            <p>${formattedDate} at ${booking.time}</p>
          </div>
        </div>
        <div class="detail-item">
          <i class="fas fa-home"></i>
          <div>
            <h4>Property Size</h4>
            <p>${booking.size.charAt(0).toUpperCase() + booking.size.slice(1)}</p>
          </div>
        </div>
        <div class="detail-item">
          <i class="fas fa-store"></i>
          <div>
            <h4>Vendor</h4>
            <p>${booking.vendor}</p>
          </div>
        </div>
        ${booking.details ? `
        <div class="detail-item">
          <i class="fas fa-info-circle"></i>
          <div>
            <h4>Special Instructions</h4>
            <p>${booking.details}</p>
          </div>
        </div>
        ` : ''}
        <div class="price-total">
          <span>Total</span>
          <span class="price">${booking.price}</span>
        </div>
      </div>
      <div class="booking-actions">
        <button class="cta-button" onclick="closeModal('bookingDetailsModal')">
          <i class="fas fa-check-circle"></i> <span>Done</span>
        </button>
      </div>
    `;
    
    // Update modal content
    document.getElementById('bookingDetailsContent').innerHTML = content;
    
    // Open confirmation modal
    openModal('bookingDetailsModal');
  }

  const userProfileForm = document.getElementById('userProfileForm');
  if (userProfileForm) {
    userProfileForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const name = document.getElementById('userName').value;
      const phone = document.getElementById('userPhone').value;
      const email = document.getElementById('userEmail').value;
      const address = document.getElementById('userAddress').value;
      
      if (!name || !phone || !email) {
        alert('Please fill in all required fields');
        return;
      }
      
      // Update user profile
      currentUser = {
        ...currentUser,
        name,
        phone,
        email,
        address
      };
      
      // Update UI
      document.getElementById('userGreeting').textContent = `Welcome, ${name.split(' ')[0]}`;
      document.getElementById('dashboardUserName').innerHTML = `Welcome back, <strong>${name}</strong>!`;
      
      // Close modal
      closeModal('userProfileModal');
      
      // Show success message
      alert('Profile updated successfully!');
    });
  }

  const vendorProfileForm = document.getElementById('vendorProfileForm');
  if (vendorProfileForm) {
    vendorProfileForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const companyName = document.getElementById('vendorCompanyName').value;
      const phone = document.getElementById('vendorPhone').value;
      const description = document.getElementById('vendorCompanyDescription').value;
      
      if (!companyName || !phone || !description) {
        alert('Please fill in all required fields');
        return;
      }
      
      // Get selected services
      const selectedServices = Array.from(document.querySelectorAll('.service-tag.active'))
        .map(tag => tag.textContent);
      
      // Get selected areas
      const selectedAreas = Array.from(document.querySelectorAll('.area-tag.active'))
        .map(tag => tag.textContent);
      
      // Update vendor profile
      currentUser = {
        ...currentUser,
        companyName,
        phone,
        description,
        services: selectedServices,
        areas: selectedAreas
      };
      
      // Update UI
      document.getElementById('dashboardVendorName').innerHTML = `Welcome back, <strong>${companyName}</strong>!`;
      
      // Show success message
      alert('Business profile updated successfully!');
    });
  }

  const paymentForm = document.getElementById('paymentForm');
  if (paymentForm) {
    paymentForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const cardNumber = document.getElementById('cardNumber').value;
      const expiry = document.getElementById('expiry').value;
      const cvv = document.getElementById('cvv').value;
      const cardName = document.getElementById('cardName').value;
      
      if (!cardNumber || !expiry || !cvv || !cardName) {
        alert('Please fill in all fields');
        return;
      }
      
      // Simple validation
      if (cardNumber.replace(/\s/g, '').length !== 16) {
        alert('Please enter a valid 16-digit card number');
        return;
      }
      
      if (cvv.length !== 3) {
        alert('Please enter a valid 3-digit CVV');
        return;
      }
      
      // Add payment method
      const lastFour = cardNumber.slice(-4);
      const cardType = cardNumber.startsWith('4') ? 'Visa' : 'Mastercard';
      
      // Create new payment card element
      const paymentCard = document.createElement('div');
      paymentCard.className = 'payment-card';
      paymentCard.innerHTML = `
        <div class="card-brand">
          <i class="fab fa-cc-${cardType.toLowerCase()}"></i>
          <span>${cardType}</span>
        </div>
        <div class="card-number">•••• •••• •••• ${lastFour}</div>
        <div class="card-expiry">Expires ${expiry}</div>
        <button class="card-remove" aria-label="Remove card">
          <i class="fas fa-trash"></i>
        </button>
      `;
      
      // Add event listener to remove button
      paymentCard.querySelector('.card-remove').addEventListener('click', function() {
        paymentCard.remove();
      });
      
      // Insert before add payment button
      const paymentMethods = document.querySelector('.payment-methods');
      const addPaymentBtn = document.querySelector('.add-payment-btn');
      paymentMethods.insertBefore(paymentCard, addPaymentBtn);
      
      // Reset and hide form
      togglePaymentForm();
      
      // Show success message
      alert('Payment method added successfully!');
    });
  }

  // Image Preview for Avatar Upload
  const avatarUpload = document.getElementById('userAvatar');
  if (avatarUpload) {
    avatarUpload.addEventListener('change', function() {
      const file = this.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
          document.getElementById('userAvatarPreview').src = e.target.result;
          document.getElementById('dashboardUserAvatar').src = e.target.result;
          document.getElementById('userAvatar').src = e.target.result;
        }
        reader.readAsDataURL(file);
      }
    });
  }

  // Initialize vendor filtering
  filterVendors('all');
  showTab(currentTab);
});

// Vendor Data (for demo purposes)
const vendors = [
  {
    id: 1,
    name: "CleanPro Services",
    category: "home",
    image: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    rating: 4.9,
    location: "City Bowl",
    experience: "5+ years experience",
    description: "Professional home cleaning with eco-friendly products. Specializing in deep cleaning and move-in/move-out services.",
    price: "From R250"
  },
  {
    id: 2,
    name: "OfficeClean Solutions",
    category: "office",
    image: "https://images.unsplash.com/photo-1521791136064-7986c2920216?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1469&q=80",
    rating: 4.8,
    location: "City Bowl & Surrounds",
    experience: "8+ years experience",
    description: "Commercial cleaning specialists offering daily, weekly, and monthly office cleaning packages.",
    price: "From R350"
  },
  {
    id: 3,
    name: "Sparkle & Shine",
    category: "home",
    image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    rating: 4.7,
    location: "Southern Suburbs",
    experience: "3+ years experience",
    description: "Reliable home cleaning service with attention to detail. We bring our own eco-friendly supplies.",
    price: "From R300"
  },
  {
    id: 4,
    name: "Deep Clean Experts",
    category: "deep",
    image: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    rating: 4.9,
    location: "All Areas",
    experience: "10+ years experience",
    description: "Specialists in deep cleaning services for homes and offices. We tackle the toughest cleaning challenges.",
    price: "From R450"
  },
  {
    id: 5,
    name: "Auto Shine",
    category: "vehicle",
    image: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    rating: 4.6,
    location: "Northern Suburbs",
    experience: "4+ years experience",
    description: "Mobile car cleaning service that comes to you. Interior and exterior cleaning with premium products.",
    price: "From R200"
  },
  {
    id: 6,
    name: "Eco Clean Team",
    category: "home",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    rating: 4.8,
    location: "Atlantic Seaboard",
    experience: "6+ years experience",
    description: "Environmentally friendly cleaning service using only non-toxic, biodegradable products.",
    price: "From R350"
  }
];

// Populate vendors (for demo purposes)
function populateVendors() {
  const container = document.getElementById('vendorsContainer');
  
  vendors.forEach(vendor => {
    const card = document.createElement('div');
    card.className = 'vendor-card';
    card.dataset.category = vendor.category;
    
    card.innerHTML = `
      <div class="vendor-image">
        <img src="${vendor.image}" alt="${vendor.name}" width="400" height="300">
        <div class="rating-badge">
          <i class="fas fa-star"></i> ${vendor.rating}
        </div>
      </div>
      <div class="vendor-info">
        <h3>${vendor.name}</h3>
        <div class="vendor-meta">
          <span><i class="fas fa-map-marker-alt"></i> ${vendor.location}</span>
          <span><i class="fas fa-clock"></i> ${vendor.experience}</span>
        </div>
        <p>${vendor.description}</p>
        <div class="vendor-footer">
          <span class="price">${vendor.price}</span>
          <button class="cta-button outline" onclick="openModal('bookingModal')">
            Book Now
          </button>
        </div>
      </div>
    `;
    
    container.appendChild(card);
  });
}

// Initialize vendor population
if (document.getElementById('vendorsContainer')) {
  populateVendors();
}

// Filter vendors
function filterVendors(filter) {
  const vendorCards = document.querySelectorAll('.vendor-card');
  
  vendorCards.forEach(card => {
    if (filter === 'all' || card.dataset.category === filter) {
      card.style.display = 'block';
      setTimeout(() => {
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
      }, 10);
    } else {
      card.style.opacity = '0';
      card.style.transform = 'translateY(20px)';
      setTimeout(() => {
        card.style.display = 'none';
      }, 300);
    }
  });
}
