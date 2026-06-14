import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import useDocumentTitle from "../hooks/useDocumentTitle";

const ScrollReveal = ({ children, delay = 0, className = "" }) => {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
      }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      if (elementRef.current) {
        observer.unobserve(elementRef.current);
      }
    };
  }, []);

  return (
    <div
      ref={elementRef}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-700 ease-out ${isVisible
        ? "opacity-100 translate-y-0"
        : "opacity-0 translate-y-6"
        } ${className}`}
    >
      {children}
    </div>
  );
};

const LandingPage = () => {
  useDocumentTitle("Smart Inventory Solutions");

  const [activeTab, setActiveTab] = useState("tracking");
  const [simulatedStock, setSimulatedStock] = useState([
    { name: "Wireless Earbuds", stock: 45, status: "Optimal" },
    { name: "Smart Watch S4", stock: 8, status: "Low Stock" },
    { name: "USB-C Fast Charger", stock: 120, status: "Optimal" },
  ]);
  const [barcodeScanned, setBarcodeScanned] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "" });
  const [formErrors, setFormErrors] = useState({});

  const handleSimulateScan = () => {
    setBarcodeScanned(true);
    setTimeout(() => {
      setBarcodeScanned(false);
      setSimulatedStock((prev) => {
        const updated = [...prev];
        updated[1] = { name: "Smart Watch S4", stock: 58, status: "Restocked" };
        return updated;
      });
    }, 1800);
  };

  const scrollToForm = () => {
    document.getElementById("signup-form")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = "Name is required";
    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Please enter a valid email";
    }
    if (!formData.phone.trim()) {
      errors.phone = "Phone number is required";
    } else if (!/^\+?[0-9\s-]{8,15}$/.test(formData.phone)) {
      errors.phone = "Please enter a valid phone number";
    }
    return errors;
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    setIsSubmitting(true);

    try {
      const response = await fetch("https://formspree.io/f/mojbepkn", {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setIsSubmitted(true);
      } else {
        alert("Oops! There was a problem submitting your form. Please try again.");
      }
    } catch (error) {
      console.error("Form submission error:", error);
      alert("Oops! There was a problem submitting your form. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#f8f8fa] text-gray-900 font-sans selection:bg-gray-200 selection:text-gray-900 overflow-x-hidden">
      {/* Background layers */}
      <div className="landing-gradient-mesh pointer-events-none fixed inset-0 z-0" aria-hidden="true" />
      <div className="landing-dot-grid pointer-events-none fixed inset-0 z-0 opacity-50" aria-hidden="true" />

      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-[#f8f8fa]/80 backdrop-blur-md border-b border-gray-200/80">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center">
            <img src="/logo.png" alt="Yinventory Logo" className="landing-logo h-9 w-auto object-contain cursor-pointer" />
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-500">
            <button onClick={scrollToForm} className="landing-nav-link hover:text-gray-900 cursor-pointer">Features</button>
            <a href="#ai-ml" className="landing-nav-link hover:text-gray-900">AI Recommendations</a>
            <a href="#demo" className="landing-nav-link hover:text-gray-900">Interactive Demo</a>
          </div>

          <div className="flex items-center gap-3">
            <Link to="/login" className="landing-nav-link text-sm font-medium text-gray-600 hover:text-gray-900 px-3 py-1.5">
              Sign In
            </Link>
            <button
              onClick={scrollToForm}
              className="landing-btn-primary bg-gray-900 hover:bg-gray-800 text-white text-xs font-medium px-4 py-2 rounded-lg cursor-pointer"
            >
              Get It Now
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 pt-20 pb-16 text-center flex flex-col items-center">
        <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[min(900px,100%)] h-[420px] bg-[radial-gradient(ellipse_at_center,_rgba(99,102,241,0.08)_0%,_transparent_70%)]" aria-hidden="true" />
        <ScrollReveal>
          <span className="px-3 py-1 rounded-full border border-gray-200 bg-gray-50 text-gray-600 text-xs font-medium tracking-wide uppercase mb-6 inline-block">
            Future of Inventory Management
          </span>
        </ScrollReveal>

        <ScrollReveal delay={100}>
          <h1 className="text-4xl md:text-6xl font-semibold tracking-tight leading-tight mb-6 text-gray-900">
            Inventory management & POS, <br className="hidden md:block" />
            reimagined for efficiency.
          </h1>
        </ScrollReveal>

        <ScrollReveal delay={200}>
          <p className="text-gray-500 text-base md:text-lg max-w-2xl mb-10 leading-relaxed">
            Eliminate operational overhead with automated restock predictions, high-speed barcode actions, and predictive intelligence. Beautifully engineered to streamline your commerce workflow.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={300}>
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-center">
            <button
              onClick={scrollToForm}
              className="landing-btn-primary w-full sm:w-auto bg-gray-900 hover:bg-gray-800 text-white font-medium px-7 py-3 rounded-lg cursor-pointer"
            >
              Secure Free Access
            </button>
            <button
              onClick={() => document.getElementById("demo")?.scrollIntoView({ behavior: "smooth" })}
              className="landing-btn-secondary w-full sm:w-auto border border-gray-300 hover:border-gray-400 bg-white hover:bg-gray-50 text-gray-700 font-medium px-7 py-3 rounded-lg flex items-center justify-center gap-2"
            >
              See Live Demo <span className="landing-arrow text-gray-400">→</span>
            </button>
          </div>
        </ScrollReveal>

        {/* Hero App Mockup */}
        <ScrollReveal delay={400} className="w-full mt-16 max-w-4xl">
          <div className="landing-hover-card rounded-xl border border-gray-200 bg-gray-50 p-1 shadow-sm cursor-default">
            <div className="rounded-lg border border-gray-200 bg-white overflow-hidden p-5 text-left">
              <div className="flex items-center justify-between pb-5 border-b border-gray-100">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-gray-300" />
                  <div className="w-2.5 h-2.5 rounded-full bg-gray-300" />
                  <div className="w-2.5 h-2.5 rounded-full bg-gray-300" />
                </div>
                <div className="text-xs text-gray-400 bg-gray-50 px-3 py-1 rounded border border-gray-200 font-mono">
                  demo.yinventory.app
                </div>
                <div className="w-6" />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 pt-5">
                <div className="lg:col-span-2">
                  <div className="border border-gray-200 rounded-lg p-4 bg-white">
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">Live Demand & Sales Analytics</h4>
                        <p className="text-xs text-gray-400">Hourly projections</p>
                      </div>
                      <span className="text-xs bg-gray-100 text-gray-600 font-medium px-2 py-0.5 rounded border border-gray-200">
                        +28.4% growth
                      </span>
                    </div>
                    <div className="h-36 flex items-end gap-2 pt-4 border-b border-gray-100 group/chart">
                      <div className="landing-chart-bar flex-1 bg-gray-100 rounded-t h-[20%] cursor-pointer" />
                      <div className="landing-chart-bar flex-1 bg-gray-100 rounded-t h-[40%] cursor-pointer" />
                      <div className="landing-chart-bar flex-1 bg-gray-100 rounded-t h-[35%] cursor-pointer" />
                      <div className="landing-chart-bar flex-1 bg-gray-200 rounded-t h-[65%] cursor-pointer" />
                      <div className="landing-chart-bar flex-1 bg-gray-900 rounded-t h-[85%] cursor-pointer" />
                    </div>
                  </div>
                </div>

                <div className="border border-gray-200 rounded-lg p-4 bg-white space-y-3">
                  <h4 className="text-sm font-medium text-gray-900">Dynamic Stock Operations</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center p-3 border border-red-100 bg-red-50 rounded-lg transition-transform duration-200 hover:scale-[1.02] hover:shadow-sm cursor-default">
                      <div>
                        <p className="font-medium text-gray-900 text-xs">Smart Watch S4</p>
                        <p className="text-[10px] text-gray-400">Barcode: #9310</p>
                      </div>
                      <span className="text-xs font-medium text-red-600">8 Units Left</span>
                    </div>
                    <div className="flex justify-between items-center p-3 border border-green-100 bg-green-50 rounded-lg transition-transform duration-200 hover:scale-[1.02] hover:shadow-sm cursor-default">
                      <div>
                        <p className="font-medium text-gray-900 text-xs">Wireless Earbuds</p>
                        <p className="text-[10px] text-gray-400">Barcode: #4041</p>
                      </div>
                      <span className="text-xs font-medium text-green-600">Optimal</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* Core stats */}
      <section className="relative z-10 border-y border-gray-200/80 bg-white/50 backdrop-blur-sm py-14">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
          <ScrollReveal>
            <div className="landing-stat-item">
            <h3 className="text-3xl font-semibold text-gray-900 mb-1 transition-colors duration-300">99.9%</h3>
            <p className="text-sm text-gray-500">Inventory Sync Accuracy</p>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={100}>
            <div className="landing-stat-item">
            <h3 className="text-3xl font-semibold text-gray-900 mb-1 transition-colors duration-300">&lt; 2s</h3>
            <p className="text-sm text-gray-500">Barcode Scan & Record Time</p>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={200}>
            <div className="landing-stat-item">
            <h3 className="text-3xl font-semibold text-gray-900 mb-1 transition-colors duration-300">15hr+</h3>
            <p className="text-sm text-gray-500">Operational Time Saved Weekly</p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* AI/ML Feature Section */}
      <section id="ai-ml" className="relative z-10 max-w-6xl mx-auto px-6 py-24">
        <div className="pointer-events-none absolute top-1/2 right-0 -translate-y-1/2 w-[420px] h-[420px] bg-[radial-gradient(circle,_rgba(168,85,247,0.06)_0%,_transparent_70%)]" aria-hidden="true" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
          <ScrollReveal>
            <span className="px-3 py-1 rounded-full border border-gray-200 bg-gray-50 text-gray-600 text-xs font-medium tracking-wider uppercase mb-5 inline-block">
              Machine Learning Powered
            </span>
            <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 tracking-tight mb-5">
              Personalized Customer Suggestions, <br />
              automatically compiled.
            </h2>
            <p className="text-gray-500 text-base leading-relaxed mb-7">
              Yinventory integrates advanced AI/ML algorithms directly into your product workflows. It constantly analyzes historic client buying trends, restock speed, and product frequencies to generate **personalized dynamic product recommendations** tailored to your customers.
            </p>
            <ul className="space-y-3">
              {[
                "Increase customer retention with personalized smart offers.",
                "Automated demand-spike predictions to prevent stockouts.",
                "Intelligent suggestions integrated directly on your checkout dashboard."
              ].map((benefit, idx) => (
                <li key={idx} className="landing-benefit-item flex items-start gap-3 cursor-default">
                  <span className="h-5 w-5 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-xs text-gray-600 mt-0.5">✓</span>
                  <span className="text-sm text-gray-600">{benefit}</span>
                </li>
              ))}
            </ul>
          </ScrollReveal>

          <ScrollReveal delay={200}>
            <div className="landing-hover-panel rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-3 mb-5">
                <div className="h-8 w-8 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center">
                  <span className="text-base">✨</span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 text-sm">Yinventory AI Recommendation Engine</h4>
                  <p className="text-[10px] text-gray-400">Live active pipeline</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="landing-ai-card border border-gray-200 rounded-lg p-4 bg-gray-50 cursor-default">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-medium text-gray-500">DEMAND SPIKE FORECAST</span>
                    <span className="text-[10px] bg-white text-gray-600 px-2 py-0.5 rounded border border-gray-200 font-mono">94% Confidence</span>
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Personalized suggestion for <strong className="text-gray-900">Premium Coffee Beans</strong> is spiking. Demand will increase by <strong className="text-green-600">42% this weekend</strong>.
                  </p>
                  <div className="mt-3 text-[10px] text-gray-400 border-t border-gray-200 pt-2 flex justify-between items-center">
                    <span>Suggested Action: Increase stock +25 units</span>
                    <span className="landing-action-link text-gray-700 font-medium cursor-pointer">Apply Action</span>
                  </div>
                </div>

                <div className="landing-ai-card border border-gray-200 rounded-lg p-4 bg-gray-50 cursor-default">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-medium text-gray-500">CROSS-SELL SUGGESTION</span>
                    <span className="text-[10px] bg-white text-gray-600 px-2 py-0.5 rounded border border-gray-200 font-mono">89% Correlation</span>
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Customers who purchase <strong className="text-gray-900">Smart Watch S4</strong> are high-probability buyers for <strong className="text-gray-900">Fast Charger Cables</strong>.
                  </p>
                  <div className="mt-3 text-[10px] text-gray-400 border-t border-gray-200 pt-2 flex justify-between items-center">
                    <span>Suggested Bundle Discount: 12% off set</span>
                    <span className="landing-action-link text-gray-700 font-medium cursor-pointer">Create Bundle</span>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Interactive Demo */}
      <section id="demo" className="relative z-10 max-w-6xl mx-auto px-6 py-24 border-t border-gray-200/80">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-indigo-50/40 via-transparent to-blue-50/30" aria-hidden="true" />
        <div className="relative">
        <ScrollReveal className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 tracking-tight mb-3">
            Engineered with absolute precision.
          </h2>
          <p className="text-gray-500 text-sm md:text-base">
            Click through our interactive simulator below to experience the responsive feel of Yinventory.
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-4 flex flex-row lg:flex-col overflow-x-auto lg:overflow-x-visible gap-2 border-b lg:border-b-0 lg:border-l border-gray-200 pb-4 lg:pb-0 lg:pl-4">
            {[
              { id: "tracking", title: "📦 Stock Tracking", desc: "Interactive inventory monitoring." },
              { id: "scanning", title: "⚡ Barcode Scanner", desc: "Rapid stock updates with barcode simulation." },
              { id: "analytics", title: "📊 Sales Projections", desc: "Detailed timeline metrics at a glance." },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`landing-tab-btn flex-shrink-0 text-left p-4 rounded-lg outline-none w-[200px] lg:w-full cursor-pointer ${activeTab === tab.id
                  ? "bg-gray-100 border border-gray-200 text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-900 hover:bg-gray-50 border border-transparent"
                  }`}
              >
                <p className="font-medium text-sm mb-0.5">{tab.title}</p>
                <p className="text-xs text-gray-400 line-clamp-1">{tab.desc}</p>
              </button>
            ))}
          </div>

          <div className="landing-hover-panel lg:col-span-8 border border-gray-200 rounded-xl p-5 min-h-[360px] flex flex-col justify-center bg-white">
            {activeTab === "tracking" && (
              <ScrollReveal className="space-y-5">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium text-gray-900 text-lg">Real-Time Stock Monitoring</h3>
                  <span className="text-xs bg-green-50 text-green-700 border border-green-200 px-2 py-0.5 rounded font-mono">Live</span>
                </div>
                <div className="space-y-2">
                  {simulatedStock.map((item, idx) => (
                    <div key={idx} className="landing-stock-row flex justify-between items-center p-3 border border-gray-200 rounded-lg bg-gray-50 cursor-default">
                      <div>
                        <p className="font-medium text-gray-900 text-sm">{item.name}</p>
                        <p className="text-[10px] text-gray-400">Auto-synced just now</p>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-medium text-gray-900 block">{item.stock} Units</span>
                        <span className={`text-[10px] font-medium ${item.status === "Low Stock" ? "text-red-600" : "text-green-600"
                          }`}>{item.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollReveal>
            )}

            {activeTab === "scanning" && (
              <ScrollReveal className="text-center space-y-5 max-w-md mx-auto">
                <div className="h-16 w-16 rounded-xl bg-gray-100 border border-gray-200 flex items-center justify-center mx-auto text-2xl transition-transform duration-300 hover:scale-110 hover:rotate-3">
                  🏷️
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 text-lg mb-2">Simulated Barcode Scan</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    Click the button below to simulate scanning a barcode for <strong className="text-gray-900">Smart Watch S4</strong>. It will instantly restock the item automatically.
                  </p>
                </div>
                <button
                  onClick={handleSimulateScan}
                  disabled={barcodeScanned}
                  className={`landing-btn-primary w-full font-medium px-6 py-3 rounded-lg cursor-pointer ${barcodeScanned
                    ? "bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed"
                    : "bg-gray-900 hover:bg-gray-800 text-white"
                    }`}
                >
                  {barcodeScanned ? "Scanning Barcode & Processing..." : "Simulate Barcode Scan"}
                </button>
                {barcodeScanned && (
                  <p className="text-xs text-gray-500 font-medium">
                    Signal captured. Sending API payload to secure servers...
                  </p>
                )}
              </ScrollReveal>
            )}

            {activeTab === "analytics" && (
              <ScrollReveal className="space-y-5">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium text-gray-900 text-lg">Sales Metrics Overview</h3>
                  <span className="text-[10px] bg-gray-50 border border-gray-200 text-gray-500 px-3 py-1 rounded font-mono">Filter: Weekly</span>
                </div>
                <div className="h-44 flex items-end justify-between gap-2 pt-4 border-b border-gray-100">
                  {[
                    { day: "Mon", sales: 45 },
                    { day: "Tue", sales: 78 },
                    { day: "Wed", sales: 62 },
                    { day: "Thu", sales: 98 },
                    { day: "Fri", sales: 120 },
                    { day: "Sat", sales: 154 },
                    { day: "Sun", sales: 110 }
                  ].map((d, index) => (
                    <div key={index} className="flex-1 flex flex-col items-center h-full justify-end">
                      <div className="landing-chart-bar bg-gray-900 rounded-t w-full max-w-[24px] cursor-pointer" style={{ height: `${(d.sales / 160) * 100}%` }} />
                      <span className="text-[10px] text-gray-400 mt-2">{d.day}</span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between items-center text-xs text-gray-400">
                  <span>Peak Sales: Friday/Saturday</span>
                  <span>Total Weekly revenue: Rs. 66,700.00</span>
                </div>
              </ScrollReveal>
            )}
          </div>
        </div>
        </div>
      </section>

      {/* Contact Form */}
      <section id="signup-form" className="relative z-10 max-w-3xl mx-auto px-6 py-24 border-t border-gray-200/80">
        <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[radial-gradient(circle,_rgba(99,102,241,0.06)_0%,_transparent_70%)]" aria-hidden="true" />
        <ScrollReveal className="text-center max-w-xl mx-auto mb-12 relative">
          <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 tracking-tight mb-3">
            Get early access today.
          </h2>
          <p className="text-gray-500 text-sm md:text-base">
            No credit card required. Experience streamlined cloud tracking and AI features for your business.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={100} className="relative">
          <div className="landing-form-card border border-gray-200 rounded-2xl p-8 md:p-10 bg-white/80 backdrop-blur-sm shadow-sm shadow-gray-200/50">
            {isSubmitted ? (
              <div className="text-center py-10 space-y-5">
                <div className="h-14 w-14 bg-green-50 border border-green-200 text-green-600 text-3xl rounded-full flex items-center justify-center mx-auto">
                  ✓
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-gray-900">Your access has been secured!</h3>
                  <p className="text-gray-500 text-sm max-w-sm mx-auto leading-relaxed">
                    Thank you, <strong className="text-gray-900">{formData.name}</strong>. An invitation link and onboarding guide have been dispatched to <strong className="text-gray-900">{formData.email}</strong>.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setIsSubmitted(false);
                    setFormData({ name: "", email: "", phone: "" });
                  }}
                  className="landing-action-link text-xs text-gray-600 font-medium cursor-pointer"
                >
                  Submit another request
                </button>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="flex flex-col space-y-1.5 text-left">
                    <label htmlFor="name" className="text-xs font-medium tracking-wide text-gray-500 uppercase">Your Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="e.g., John Doe"
                      className={`landing-input bg-white border text-sm rounded-lg p-3 focus:outline-none placeholder:text-gray-400 ${formErrors.name
                        ? "border-red-300 focus:border-red-400 focus:ring-1 focus:ring-red-200"
                        : "border-gray-300 focus:border-gray-400 focus:ring-1 focus:ring-gray-200"
                        }`}
                    />
                    {formErrors.name && <span className="text-[10px] text-red-500 font-medium">{formErrors.name}</span>}
                  </div>

                  <div className="flex flex-col space-y-1.5 text-left">
                    <label htmlFor="phone" className="text-xs font-medium tracking-wide text-gray-500 uppercase">Phone Number</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="e.g., +91 9876543210"
                      className={`landing-input bg-white border text-sm rounded-lg p-3 focus:outline-none placeholder:text-gray-400 ${formErrors.phone
                        ? "border-red-300 focus:border-red-400 focus:ring-1 focus:ring-red-200"
                        : "border-gray-300 focus:border-gray-400 focus:ring-1 focus:ring-gray-200"
                        }`}
                    />
                    {formErrors.phone && <span className="text-[10px] text-red-500 font-medium">{formErrors.phone}</span>}
                  </div>
                </div>

                <div className="flex flex-col space-y-1.5 text-left">
                  <label htmlFor="email" className="text-xs font-medium tracking-wide text-gray-500 uppercase">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="e.g., john@example.com"
                    className={`landing-input bg-white border text-sm rounded-lg p-3 focus:outline-none placeholder:text-gray-400 ${formErrors.email
                      ? "border-red-300 focus:border-red-400 focus:ring-1 focus:ring-red-200"
                      : "border-gray-300 focus:border-gray-400 focus:ring-1 focus:ring-gray-200"
                      }`}
                  />
                  {formErrors.email && <span className="text-[10px] text-red-500 font-medium">{formErrors.email}</span>}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="landing-btn-primary w-full bg-gray-900 hover:bg-gray-800 text-white font-medium py-3.5 rounded-lg flex items-center justify-center gap-2 cursor-pointer disabled:bg-gray-300 disabled:text-gray-500 disabled:transform-none disabled:shadow-none"
                >
                  {isSubmitting ? (
                    <>
                      <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Securing Your Access...
                    </>
                  ) : (
                    "Get Early Access Instantly"
                  )}
                </button>
              </form>
            )}
          </div>
        </ScrollReveal>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-gray-200/80 bg-white/40 backdrop-blur-sm py-10 text-center text-xs text-gray-400">
        <p className="mb-1">© {new Date().getFullYear()} Yinventory. All rights reserved.</p>
        <p>Engineered for speed, built with absolute privacy.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
