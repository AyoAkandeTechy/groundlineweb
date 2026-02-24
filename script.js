// script.js
// Handles interactive behaviour for the Groundline website.

// Contact form submission
function submitForm(event) {
    event.preventDefault();
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();
    const response = document.getElementById('formResponse');

    if (name && email && message) {
        // Simulate sending the message. In a real implementation this would send data to a server.
        response.textContent = `Thank you, ${name}! Your message has been sent.`;
        // Reset form fields
        event.target.reset();
    } else {
        response.textContent = 'Please complete all fields before submitting.';
    }
    return false;
}

// Scroll-to-top button logic
document.addEventListener('DOMContentLoaded', () => {
    // Create the button element
    const scrollBtn = document.createElement('button');
    scrollBtn.className = 'scroll-top-btn';
    scrollBtn.textContent = '▲';
    document.body.appendChild(scrollBtn);

    // Show or hide button depending on scroll position
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            scrollBtn.classList.add('visible');
        } else {
            scrollBtn.classList.remove('visible');
        }
    });

    // Scroll to top when clicked
    scrollBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Fade-in effect for elements as they come into view
    const observerOptions = {
        threshold: 0.1
    };
    const onIntersection = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                observer.unobserve(entry.target);
            }
        });
    };
    const observer = new IntersectionObserver(onIntersection, observerOptions);
    const faders = document.querySelectorAll('.service-item, .value-item');
    faders.forEach(el => observer.observe(el));
});


// Manpower booking form (client-side email composition)
function handleBookingForm(event){
  event.preventDefault();
  const form = event.target;
  const status = document.getElementById('formStatus');
  if(!status) return;

  // Basic required checks
  const requiredIds = ['fullName','phone','email','serviceAddress','serviceType','urgency','staffCount','startDate','duration','shift'];
  for(const id of requiredIds){
    const el = document.getElementById(id);
    if(el && !el.value){
      status.textContent = 'Please fill all required fields (*) before submitting.';
      status.style.color = 'var(--accent, #ffcc00)';
      el.focus();
      return;
    }
  }

  const roles = Array.from(form.querySelectorAll('input[name="roles"]:checked')).map(x=>x.value);
  if(roles.length === 0){
    status.textContent = 'Please select at least one manpower role.';
    status.style.color = 'var(--accent, #ffcc00)';
    return;
  }

  const payload = {
    fullName: document.getElementById('fullName').value.trim(),
    companyName: document.getElementById('companyName').value.trim(),
    phone: document.getElementById('phone').value.trim(),
    email: document.getElementById('email').value.trim(),
    serviceAddress: document.getElementById('serviceAddress').value.trim(),
    serviceType: document.getElementById('serviceType').value,
    urgency: document.getElementById('urgency').value,
    roles,
    staffCount: document.getElementById('staffCount').value,
    startDate: document.getElementById('startDate').value,
    duration: document.getElementById('duration').value,
    shift: document.getElementById('shift').value,
    notes: (document.getElementById('notes')?.value || '').trim()
  };

  const subject = encodeURIComponent('Manpower Booking Request - ' + payload.fullName);
  const body = encodeURIComponent(
`Manpower Booking Request (Website)
---------------------------------
Full Name: ${payload.fullName}
Company/Household: ${payload.companyName || '-'}
Phone: ${payload.phone}
Email: ${payload.email}

Service Type: ${payload.serviceType}
Urgency: ${payload.urgency}
Manpower Roles: ${payload.roles.join(', ')}
Number of Staff: ${payload.staffCount}
Preferred Start Date: ${payload.startDate}
Duration: ${payload.duration}
Shift: ${payload.shift}

Service Location:
${payload.serviceAddress}

Additional Details:
${payload.notes || '-'}

(Submitted via Groundline website form)`
  );

  // Open email draft
  window.location.href = `mailto:groundlinehospitality.qa@gmail.com?subject=${subject}&body=${body}`;
  status.textContent = 'Opening your email app to send the request...';
  status.style.color = '#9be37f';
}

document.addEventListener('DOMContentLoaded', () => {
  const bookingForm = document.getElementById('bookingForm');
  if(bookingForm){
    bookingForm.addEventListener('submit', handleBookingForm);
  }
});
