import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import useDocumentTitle from "../hooks/useDocumentTitle";

// Reusable Apple-style Scroll Animation Wrapper
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
      className={`transition-all duration-1000 cubic-bezier(0.16, 1, 0.3, 1) ${isVisible
        ? "opacity-100 translate-y-0 scale-100 filter-none"
        : "opacity-0 translate-y-12 scale-98 blur-[2px]"
        } ${className}`}
    >
      {children}
    </div>
  );
};

const LandingPage = () => {
  useDocumentTitle("Smart Inventory Solutions");
  const navigate = useNavigate();

  // State for interactive features
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

  // Trigger simulated barcode scan
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

  // Scroll to signup form
  const scrollToForm = () => {
    document.getElementById("signup-form")?.scrollIntoView({ behavior: "smooth" });
  };

  // Form submission handler
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
    <div className="min-h-screen bg-[#050505] text-gray-200 font-sans selection:bg-indigo-500/30 selection:text-indigo-200 overflow-x-hidden">
      {/* Background Decorative Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-violet-900/5 to-transparent pointer-events-none z-0" />
      <div className="absolute top-[1200px] right-0 w-[500px] h-[500px] bg-violet-600/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-[2200px] left-0 w-[500px] h-[500px] bg-indigo-600/5 blur-[120px] rounded-full pointer-events-none" />

      {/* Sticky Premium Navbar */}
      <nav className="sticky top-0 z-50 backdrop-blur-md bg-[#050505]/75 border-b border-white/5 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center">
            <img src="/logo.png" alt="Yinventory Logo" className="h-10 w-auto object-contain" />
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-400">
            <button onClick={scrollToForm} className="hover:text-white transition-colors cursor-pointer">Features</button>
            <a href="#ai-ml" className="hover:text-white transition-colors">AI Recommendations</a>
            <a href="#demo" className="hover:text-white transition-colors">Interactive Demo</a>
          </div>

          <div className="flex items-center gap-4">
            <Link to="/login" className="text-sm font-medium text-gray-400 hover:text-white transition-colors px-3 py-1.5 rounded-lg hover:bg-white/5">
              Sign In
            </Link>
            <button
              onClick={scrollToForm}
              className="bg-white hover:bg-gray-100 text-black text-xs font-semibold px-4 py-2 rounded-full transition-all shadow-md shadow-white/5 cursor-pointer"
            >
              Get It Now
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pt-24 pb-20 text-center flex flex-col items-center">
        <ScrollReveal>
          <span className="px-3.5 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-400 text-xs font-semibold tracking-wide uppercase mb-6 inline-block">
            Next Generation Inventory Control
          </span>
        </ScrollReveal>

        <ScrollReveal delay={100}>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-none mb-6">
            Inventory management & POS, <br className="hidden md:block" />
            <span className="bg-gradient-to-r from-white via-gray-300 to-gray-500 bg-clip-text text-transparent">
              reimagined for efficiency.
            </span>
          </h1>
        </ScrollReveal>

        <ScrollReveal delay={200}>
          <p className="text-gray-400 text-base md:text-xl max-w-2xl mb-10 leading-relaxed">
            Eliminate operational overhead with automated restock predictions, high-speed barcode actions, and predictive intelligence. Beautifully engineered to streamline your commerce workflow.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={300}>
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
            <button
              onClick={scrollToForm}
              className="w-full sm:w-auto bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white font-semibold px-8 py-3.5 rounded-full transition-all shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/35 cursor-pointer"
            >
              Secure Free Access
            </button>
            <button
              onClick={() => document.getElementById("demo")?.scrollIntoView({ behavior: "smooth" })}
              className="w-full sm:w-auto border border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/10 text-white font-semibold px-8 py-3.5 rounded-full transition-all flex items-center justify-center gap-2"
            >
              See Live Demo <span className="text-indigo-400">→</span>
            </button>
          </div>
        </ScrollReveal>

        {/* Hero Interactive App Mockup */}
        <ScrollReveal delay={400} className="w-full mt-20 max-w-5xl">
          <div className="relative rounded-2xl border border-white/10 bg-gradient-to-b from-[#0F0F13] to-[#050505] p-2 shadow-2xl shadow-indigo-500/5">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-violet-500/10 opacity-30 rounded-2xl blur-xl pointer-events-none" />
            <div className="rounded-xl border border-white/5 bg-[#08080C] overflow-hidden p-6 text-left">
              {/* Header */}
              <div className="flex items-center justify-between pb-6 border-b border-white/5">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/60" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                  <div className="w-3 h-3 rounded-full bg-green-500/60" />
                </div>
                <div className="text-xs text-gray-500 bg-white/5 px-4 py-1 rounded-md border border-white/5 font-mono">
                  demo.yinventory.app
                </div>
                <div className="w-6" />
              </div>

              {/* Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-6">
                <div className="lg:col-span-2 space-y-6">
                  {/* Sales Graph Mockup */}
                  <div className="bg-white/3 border border-white/5 rounded-xl p-5">
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <h4 className="text-sm font-semibold text-white">Live Demand & Sales Analytics</h4>
                        <p className="text-xs text-gray-500">Hourly projections</p>
                      </div>
                      <span className="text-xs bg-indigo-500/10 text-indigo-400 font-semibold px-2.5 py-1 rounded-full border border-indigo-500/20">
                        +28.4% growth
                      </span>
                    </div>
                    <div className="h-40 flex items-end gap-3 pt-6 border-b border-white/5">
                      <div className="flex-1 bg-white/5 rounded-t h-[20%] transition-all hover:bg-indigo-500/40" />
                      <div className="flex-1 bg-white/5 rounded-t h-[40%] transition-all hover:bg-indigo-500/40" />
                      <div className="flex-1 bg-white/5 rounded-t h-[35%] transition-all hover:bg-indigo-500/40" />
                      <div className="flex-1 bg-white/10 rounded-t h-[65%] transition-all hover:bg-indigo-500/40" />
                      <div className="flex-1 bg-indigo-500/80 rounded-t h-[85%] animate-pulse" />
                    </div>
                  </div>
                </div>

                {/* Real-time Alerts Mockup */}
                <div className="bg-white/3 border border-white/5 rounded-xl p-5 space-y-4">
                  <h4 className="text-sm font-semibold text-white">Dynamic Stock Operations</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 border border-red-500/20 bg-red-500/5 rounded-lg">
                      <div>
                        <p className="font-semibold text-white text-xs">Smart Watch S4</p>
                        <p className="text-[10px] text-gray-500">Barcode: #9310</p>
                      </div>
                      <span className="text-xs font-bold text-red-400">8 Units Left</span>
                    </div>
                    <div className="flex justify-between items-center p-3 border border-emerald-500/20 bg-emerald-500/5 rounded-lg">
                      <div>
                        <p className="font-semibold text-white text-xs">Wireless Earbuds</p>
                        <p className="text-[10px] text-gray-500">Barcode: #4041</p>
                      </div>
                      <span className="text-xs font-bold text-emerald-400">Optimal</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* Brand values / Core stats */}
      <section className="border-y border-white/5 bg-[#08080C]/40 py-16">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
          <ScrollReveal>
            <h3 className="text-4xl font-extrabold text-white mb-2">99.9%</h3>
            <p className="text-sm text-gray-400">Inventory Sync Accuracy</p>
          </ScrollReveal>
          <ScrollReveal delay={100}>
            <h3 className="text-4xl font-extrabold text-white mb-2">&lt; 2s</h3>
            <p className="text-sm text-gray-400">Barcode Scan & Record Time</p>
          </ScrollReveal>
          <ScrollReveal delay={200}>
            <h3 className="text-4xl font-extrabold text-white mb-2">15hr+</h3>
            <p className="text-sm text-gray-400">Operational Time Saved Weekly</p>
          </ScrollReveal>
        </div>
      </section>

      {/* AI/ML Predictive Intelligence Feature Section */}
      <section id="ai-ml" className="max-w-7xl mx-auto px-6 py-28 relative">
        <div className="absolute top-1/2 left-1/4 w-[400px] h-[400px] bg-indigo-600/10 blur-[100px] rounded-full pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <ScrollReveal>
            <span className="px-3 py-1 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-400 text-xs font-semibold tracking-wider uppercase mb-6 inline-block">
              Machine Learning Powered
            </span>
            <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-6">
              Personalized Customer Suggestions, <br className="text-indigo-400" />
              automatically compiled.
            </h2>
            <p className="text-gray-400 text-base md:text-lg leading-relaxed mb-8">
              Yinventory integrates advanced AI/ML algorithms directly into your product workflows. It constantly analyzes historic client buying trends, restock speed, and product frequencies to generate **personalized dynamic product recommendations** tailored to your customers.
            </p>
            <ul className="space-y-4">
              {[
                "Increase customer retention with personalized smart offers.",
                "Automated demand-spike predictions to prevent stockouts.",
                "Intelligent suggestions integrated directly on your checkout dashboard."
              ].map((benefit, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <span className="h-5 w-5 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-xs text-indigo-400 mt-0.5">✓</span>
                  <span className="text-sm text-gray-300">{benefit}</span>
                </li>
              ))}
            </ul>
          </ScrollReveal>

          {/* AI/ML Dynamic Forecast simulator */}
          <ScrollReveal delay={200} className="relative">
            <div className="rounded-2xl border border-indigo-500/20 bg-gradient-to-tr from-[#0F0F1A] via-[#070712] to-[#0A0718] p-6 shadow-xl shadow-indigo-500/10 overflow-hidden relative group">
              <div className="absolute -top-10 -right-10 w-44 h-44 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none transition-all group-hover:scale-150 duration-700" />

              <div className="flex items-center gap-3 mb-6">
                <div className="h-9 w-9 rounded-lg bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center">
                  <span className="text-lg">✨</span>
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">Yinventory AI Recommendation Engine</h4>
                  <p className="text-[10px] text-gray-500">Live active pipeline</p>
                </div>
              </div>

              {/* Simulated Predictions */}
              <div className="space-y-4">
                <div className="bg-white/2 border border-white/5 rounded-xl p-4 transition-all hover:bg-white/5">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-semibold text-indigo-300">DEMAND SPIKE FORECAST</span>
                    <span className="text-[10px] bg-indigo-500/20 text-indigo-400 px-2 py-0.5 rounded-full font-mono font-bold border border-indigo-500/30">94% Confidence</span>
                  </div>
                  <p className="text-xs text-gray-300 leading-relaxed">
                    Personalized suggestion for <strong className="text-white">Premium Coffee Beans</strong> is spiking. Demand will increase by <strong className="text-emerald-400">42% this weekend</strong>.
                  </p>
                  <div className="mt-3 text-[10px] text-gray-500 border-t border-white/5 pt-2 flex justify-between items-center">
                    <span>Suggested Action: Increase stock +25 units</span>
                    <span className="text-indigo-400 font-semibold cursor-pointer hover:underline">Apply Action</span>
                  </div>
                </div>

                <div className="bg-white/2 border border-white/5 rounded-xl p-4 transition-all hover:bg-white/5">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-semibold text-indigo-300">CROSS-SELL SUGGESTION</span>
                    <span className="text-[10px] bg-indigo-500/20 text-indigo-400 px-2 py-0.5 rounded-full font-mono font-bold border border-indigo-500/30">89% Correlation</span>
                  </div>
                  <p className="text-xs text-gray-300 leading-relaxed">
                    Customers who purchase <strong className="text-white">Smart Watch S4</strong> are high-probability buyers for <strong className="text-white">Fast Charger Cables</strong>.
                  </p>
                  <div className="mt-3 text-[10px] text-gray-500 border-t border-white/5 pt-2 flex justify-between items-center">
                    <span>Suggested Bundle Discount: 12% off set</span>
                    <span className="text-indigo-400 font-semibold cursor-pointer hover:underline">Create Bundle</span>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Core Features Apple-Style Scrolling Showcase */}
      <section id="demo" className="max-w-7xl mx-auto px-6 py-28 border-t border-white/5">
        <ScrollReveal className="text-center max-w-2xl mx-auto mb-20">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4">
            Engineered with absolute precision.
          </h2>
          <p className="text-gray-400 text-sm md:text-base">
            Click through our interactive simulator below to experience the responsive feel of Yinventory.
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Menu Selector */}
          <div className="lg:col-span-4 flex flex-row lg:flex-col overflow-x-auto lg:overflow-x-visible gap-2 border-b lg:border-b-0 lg:border-l border-white/5 pb-4 lg:pb-0 lg:pl-4 scrollbar-none">
            {[
              { id: "tracking", title: "📦 Stock Tracking", desc: "Interactive inventory monitoring." },
              { id: "scanning", title: "⚡ Barcode Scanner", desc: "Rapid stock updates with barcode simulation." },
              { id: "analytics", title: "📊 Sales Projections", desc: "Detailed timeline metrics at a glance." },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-shrink-0 text-left p-4 rounded-xl transition-all duration-300 outline-none w-[200px] lg:w-full cursor-pointer ${activeTab === tab.id
                  ? "bg-white/5 border border-white/10 text-white shadow-lg"
                  : "text-gray-400 hover:text-white hover:bg-white/2 border border-transparent"
                  }`}
              >
                <p className="font-bold text-sm mb-1">{tab.title}</p>
                <p className="text-xs text-gray-500 line-clamp-1">{tab.desc}</p>
              </button>
            ))}
          </div>

          {/* Interactive Screen Display */}
          <div className="lg:col-span-8 bg-white/2 border border-white/5 rounded-2xl p-6 min-h-[360px] flex flex-col justify-center shadow-inner relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-violet-600/5 blur-3xl pointer-events-none" />

            {activeTab === "tracking" && (
              <ScrollReveal className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-white text-lg">Real-Time Stock Monitoring</h3>
                  <span className="text-xs bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2.5 py-1 rounded-full animate-pulse font-mono">Live</span>
                </div>
                <div className="space-y-3">
                  {simulatedStock.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center p-3.5 bg-white/3 border border-white/5 rounded-xl transition-all hover:bg-white/5">
                      <div>
                        <p className="font-semibold text-white text-sm">{item.name}</p>
                        <p className="text-[10px] text-gray-500">Auto-synced just now</p>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-bold text-white block">{item.stock} Units</span>
                        <span className={`text-[10px] font-semibold ${item.status === "Low Stock" ? "text-red-400" : "text-emerald-400"
                          }`}>{item.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollReveal>
            )}

            {activeTab === "scanning" && (
              <ScrollReveal className="text-center space-y-6 max-w-md mx-auto">
                <div className="h-20 w-20 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center mx-auto text-3xl animate-bounce">
                  🏷️
                </div>
                <div>
                  <h3 className="font-bold text-white text-lg mb-2">Simulated Barcode Scan</h3>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    Click the button below to simulate scanning a barcode for <strong className="text-white">Smart Watch S4</strong>. It will instantly restock the item automatically.
                  </p>
                </div>
                <button
                  onClick={handleSimulateScan}
                  disabled={barcodeScanned}
                  className={`w-full font-semibold px-6 py-3 rounded-xl transition-all cursor-pointer ${barcodeScanned
                    ? "bg-indigo-600/30 text-indigo-300 border border-indigo-500/20 cursor-not-allowed"
                    : "bg-white hover:bg-gray-100 text-black shadow-md shadow-white/5"
                    }`}
                >
                  {barcodeScanned ? "Scanning Barcode & Processing..." : "Simulate Barcode Scan"}
                </button>
                {barcodeScanned && (
                  <p className="text-xs text-indigo-400 font-semibold animate-pulse">
                    ⚡ Signal captured. Sending API payload to secure servers...
                  </p>
                )}
              </ScrollReveal>
            )}

            {activeTab === "analytics" && (
              <ScrollReveal className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-white text-lg">Sales Metrics Overview</h3>
                  <span className="text-[10px] bg-white/5 border border-white/5 text-gray-400 px-3 py-1 rounded-full font-mono">Filter: Weekly</span>
                </div>
                <div className="h-44 flex items-end justify-between gap-3 pt-6 border-b border-white/5 relative">
                  {[
                    { day: "Mon", sales: 45 },
                    { day: "Tue", sales: 78 },
                    { day: "Wed", sales: 62 },
                    { day: "Thu", sales: 98 },
                    { day: "Fri", sales: 120 },
                    { day: "Sat", sales: 154 },
                    { day: "Sun", sales: 110 }
                  ].map((d, index) => (
                    <div key={index} className="flex-1 flex flex-col items-center h-full justify-end group">
                      <div className="h-full bg-gradient-to-t from-indigo-500/80 to-violet-600/80 rounded-t-md w-full max-w-[28px] transition-all hover:opacity-90 duration-500" style={{ height: `${(d.sales / 160) * 100}%` }} />
                      <span className="text-[10px] text-gray-500 mt-2">{d.day}</span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between items-center text-xs text-gray-500">
                  <span>Peak Sales: Friday/Saturday</span>
                  <span>Total Weekly revenue: Rs. 66,700.00</span>
                </div>
              </ScrollReveal>
            )}
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section id="signup-form" className="relative z-10 max-w-4xl mx-auto px-6 py-28 border-t border-white/5">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-indigo-500/5 blur-[90px] rounded-full pointer-events-none" />

        <ScrollReveal className="text-center max-w-xl mx-auto mb-14">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4">
            Get early access today.
          </h2>
          <p className="text-gray-400 text-sm md:text-base">
            No credit card required. Experience streamlined cloud tracking and AI features for your business.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={100} className="relative">
          <div className="backdrop-blur-md bg-white/3 border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden">
            {isSubmitted ? (
              <div className="text-center py-12 space-y-6 animate-fade-in">
                <div className="h-16 w-16 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-4xl rounded-full flex items-center justify-center mx-auto animate-bounce">
                  ✓
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-white">Your access has been secured!</h3>
                  <p className="text-gray-400 text-sm max-w-sm mx-auto leading-relaxed">
                    Thank you, <strong className="text-white">{formData.name}</strong>. An invitation link and onboarding guide have been dispatched to <strong className="text-white">{formData.email}</strong>.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setIsSubmitted(false);
                    setFormData({ name: "", email: "", phone: "" });
                  }}
                  className="text-xs text-indigo-400 font-semibold hover:underline cursor-pointer"
                >
                  Submit another request
                </button>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name field */}
                  <div className="flex flex-col space-y-2 text-left">
                    <label htmlFor="name" className="text-xs font-semibold tracking-wide text-gray-400 uppercase">Your Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="e.g., John Doe"
                      className={`bg-white/5 border text-sm rounded-xl p-3.5 focus:outline-none transition-all placeholder:text-gray-600 ${formErrors.name
                        ? "border-red-500/50 focus:border-red-500 focus:ring-1 focus:ring-red-500/50"
                        : "border-white/10 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50"
                        }`}
                    />
                    {formErrors.name && <span className="text-[10px] text-red-400 font-semibold">{formErrors.name}</span>}
                  </div>

                  {/* Phone field */}
                  <div className="flex flex-col space-y-2 text-left">
                    <label htmlFor="phone" className="text-xs font-semibold tracking-wide text-gray-400 uppercase">Phone Number</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="e.g., +91 9876543210"
                      className={`bg-white/5 border text-sm rounded-xl p-3.5 focus:outline-none transition-all placeholder:text-gray-600 ${formErrors.phone
                        ? "border-red-500/50 focus:border-red-500 focus:ring-1 focus:ring-red-500/50"
                        : "border-white/10 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50"
                        }`}
                    />
                    {formErrors.phone && <span className="text-[10px] text-red-400 font-semibold">{formErrors.phone}</span>}
                  </div>
                </div>

                {/* Email field */}
                <div className="flex flex-col space-y-2 text-left">
                  <label htmlFor="email" className="text-xs font-semibold tracking-wide text-gray-400 uppercase">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="e.g., john@example.com"
                    className={`bg-white/5 border text-sm rounded-xl p-3.5 focus:outline-none transition-all placeholder:text-gray-600 ${formErrors.email
                      ? "border-red-500/50 focus:border-red-500 focus:ring-1 focus:ring-red-500/50"
                      : "border-white/10 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50"
                      }`}
                  />
                  {formErrors.email && <span className="text-[10px] text-red-400 font-semibold">{formErrors.email}</span>}
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-white hover:bg-gray-100 text-black font-semibold py-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:bg-gray-600 disabled:text-gray-400"
                >
                  {isSubmitting ? (
                    <>
                      <div className="h-4 w-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
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
      <footer className="border-t border-white/5 py-12 text-center text-xs text-gray-500 relative z-10">
        <p className="mb-2">© {new Date().getFullYear()} Yinventory. All rights reserved.</p>
        <p>Engineered for speed, built with absolute privacy.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
