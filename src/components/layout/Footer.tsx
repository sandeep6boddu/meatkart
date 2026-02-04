'use client'

import Link from 'next/link'

export function Footer() {
  return (
    <footer style={{ backgroundColor: '#f9f9f9', marginTop: 'auto' }}>
      {/* Newsletter Section */}
      <div className="subscribe" style={{ backgroundColor: '#232f3e', padding: '30px 0', color: '#fff' }}>
        <div className="container">
          <div className="row" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
            <div className="col-md-6 col-sm-12" style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
              <div style={{ marginRight: '15px' }}>
                <img src="/images/message.png" alt="message" />
              </div>
              <div>
                <h3 style={{ margin: '0 0 5px 0', fontSize: '18px', fontWeight: 'bold' }}>Subscribe To Our Newsletter</h3>
                <p style={{ margin: 0, fontSize: '13px', color: '#ccc' }}>Receive latest news on Offers, Discounts, New Products & much more...</p>
              </div>
              <div style={{ marginLeft: '15px' }}>
                <img src="/images/mail-img.png" alt="mail-img" />
              </div>
            </div>

            <div className="col-md-6 col-sm-12">
              <form style={{ display: 'flex', gap: '10px' }}>
                <input
                  type="email"
                  className="form-control"
                  placeholder="Enter Your Email Address"
                  style={{ borderRadius: '0', height: '40px', border: 'none', flex: 1 }}
                />
                <button
                  type="button"
                  className="btn"
                  style={{
                    backgroundColor: '#f25648',
                    color: '#fff',
                    borderRadius: '0',
                    height: '40px',
                    padding: '0 30px',
                    fontWeight: 'bold',
                    textTransform: 'uppercase',
                    border: 'none'
                  }}
                >
                  Submit
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="footer-bottom" style={{ padding: '50px 0 20px', backgroundColor: '#fff' }}>
        <div className="container">
          {/* Using Flex/Grid for 4 columns */}
          <div className="row" style={{ display: 'flex', flexWrap: 'wrap' }}>

            {/* Column 1: Verification / Trust */}
            <div className="col-md-3 col-sm-6 text-center-mobile" style={{ marginBottom: '30px' }}>
              <h4 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '20px', textTransform: 'uppercase' }}>Payment Methods</h4>
              <p>Secure payment with:</p>
              <div style={{ margin: '15px 0' }}>
                <img src="/images/paypal.png" alt="paypal" style={{ maxWidth: '100px' }} />
              </div>
            </div>

            {/* Column 2: Quick Links */}
            <div className="col-md-3 col-sm-6 text-center-mobile" style={{ marginBottom: '30px' }}>
              <h4 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '20px', textTransform: 'uppercase' }}>Quick Links</h4>
              <ul style={{ listStyle: 'none', padding: 0, lineHeight: '2.2' }}>
                <li><Link href="/" style={{ color: '#666', textDecoration: 'none' }}>Home</Link></li>
                <li><Link href="/offers-zone" style={{ color: '#666', textDecoration: 'none' }}>Offers Zone</Link></li>
                <li><Link href="/cart" style={{ color: '#666', textDecoration: 'none' }}>My Cart</Link></li>
                <li><Link href="/login" style={{ color: '#666', textDecoration: 'none' }}>Login / Register</Link></li>
              </ul>
            </div>

            {/* Column 3: Policy / Support */}
            <div className="col-md-3 col-sm-6 text-center-mobile" style={{ marginBottom: '30px' }}>
              <h4 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '20px', textTransform: 'uppercase' }}>Support</h4>
              <ul style={{ listStyle: 'none', padding: 0, lineHeight: '2.2' }}>
                <li><Link href="#" style={{ color: '#666', textDecoration: 'none' }}>About Us</Link></li>
                <li><Link href="#" style={{ color: '#666', textDecoration: 'none' }}>Customer Support</Link></li>
                <li><Link href="#" style={{ color: '#666', textDecoration: 'none' }}>Return Policy</Link></li>
                <li><Link href="#" style={{ color: '#666', textDecoration: 'none' }}>Privacy Policy</Link></li>
                <li><Link href="#" style={{ color: '#666', textDecoration: 'none' }}>Disclaimer</Link></li>
              </ul>
            </div>

            {/* Column 4: Socials */}
            <div className="col-md-3 col-sm-6 text-center-mobile" style={{ marginBottom: '30px' }}>
              <h4 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '20px', textTransform: 'uppercase' }}>Connect with Us</h4>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-start' }} className="social-icons-container">
                <a href="#"><img src="/images/facebook.png" alt="facebook" /></a>
                <a href="#"><img src="/images/linkedin.png" alt="linkedin" /></a>
                <a href="#"><img src="/images/twitter.png" alt="twitter" /></a>
                <a href="#"><img src="/images/gplus.png" alt="gplus" /></a>
              </div>
            </div>

          </div>

          <hr style={{ borderColor: '#eee', margin: '20px 0' }} />

          {/* Copyright */}
          <div className="row">
            <div className="col-md-12 text-center">
              <p style={{ color: '#999', fontSize: '13px' }}>
                Copyrights © {new Date().getFullYear()} MeatKart. All Rights Reserved.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile fix for social icons alignment */}
      <style jsx>{`
        @media (max-width: 768px) {
          .text-center-mobile { text-align: center; }
          .social-icons-container { justifyContent: center !important; }
        }
      `}</style>
    </footer>
  )
}
