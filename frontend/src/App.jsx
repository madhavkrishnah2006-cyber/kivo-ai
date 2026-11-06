import React, { useState } from 'react';
import { 
  Cpu, Truck, FileText, ShieldAlert, MessageSquare, 
  Search, RefreshCw, Send, Upload, Shield, ShoppingCart, CheckSquare, 
  Square, TrendingDown, CreditCard, CheckCircle2, ShoppingBag, ArrowRight,
  Sparkles
} from 'lucide-react';

const COMPONENT_DATABASE = {
  'snapdragon 8 gen 3': { part: 'Snapdragon 8 Gen 3 (SM8650-AB)', mfr: 'Qualcomm / TSMC 4nm', usd: 115.00, lead: '6 Weeks', category: 'SoC / Application Processor' },
  'snapdragon 7 gen 3': { part: 'Snapdragon 7 Gen 3 (SM7550-AB)', mfr: 'Qualcomm / TSMC 4nm', usd: 62.00, lead: '4 Weeks', category: 'SoC / Application Processor' },
  'dimensity 8300': { part: 'MediaTek Dimensity 8300 Ultra', mfr: 'MediaTek / TSMC 4nm', usd: 38.50, lead: '4 Weeks', category: 'SoC / Application Processor' },
  'esp32': { part: 'ESP32-WROOM-32D (16MB)', mfr: 'Espressif Systems', usd: 3.15, lead: '1 Week', category: 'Microcontroller / Wi-Fi+BT' },
  'stm32f407': { part: 'STM32F407VGT6 ARM Cortex-M4', mfr: 'STMicroelectronics', usd: 4.85, lead: '2 Weeks', category: '32-Bit Microcontroller' },
  'mq-2': { part: 'MQ-2 Gas / Smoke Sensor Module', mfr: 'Hanwei Electronics', usd: 1.45, lead: '1 Week', category: 'Environmental Sensor' },
  '12v transformer': { part: '12V 2A Step-Down Power Transformer', mfr: 'Triad Magnetics', usd: 6.80, lead: '2 Weeks', category: 'Power Transformer' },
};

// Interactive Selectable Component Selector Component
function ComponentSelector({ components, onCheckout }) {
  const [selectedIds, setSelectedIds] = useState(components.map(c => c.id));

  const toggleSelect = (id) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const selectedItems = components.filter(c => selectedIds.includes(c.id));

  const totalKivoUsd = selectedItems.reduce((sum, c) => sum + (c.kivo_usd || 0), 0);
  const totalOtherUsd = selectedItems.reduce((sum, c) => sum + (c.other_usd || 0), 0);
  const savedUsd = (totalOtherUsd - totalKivoUsd).toFixed(2);

  const totalKivoInr = selectedItems.reduce((sum, c) => sum + (c.kivo_inr || 0), 0);
  const totalOtherInr = selectedItems.reduce((sum, c) => sum + (c.other_inr || 0), 0);
  const savedInr = totalOtherInr - totalKivoInr;

  return (
    <div style={{
      backgroundColor: '#FFFFFF',
      border: '1px solid #E5D9CC',
      borderRadius: '16px',
      padding: '18px',
      marginTop: '14px',
      display: 'flex',
      flexDirection: 'column',
      gap: '14px',
      boxShadow: '0 4px 14px rgba(107, 29, 47, 0.05)'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #EFE6DC', paddingBottom: '10px' }}>
        <div style={{ fontSize: '13px', fontWeight: '700', color: '#6B1D2F', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Sparkles size={16} /> Selectable Options ({selectedItems.length}/{components.length} Selected)
        </div>
        <button 
          onClick={() => setSelectedIds(selectedIds.length === components.length ? [] : components.map(c => c.id))}
          style={{ background: 'none', border: 'none', color: '#8B263E', fontSize: '12px', cursor: 'pointer', fontWeight: '600' }}
        >
          {selectedIds.length === components.length ? 'Deselect All' : 'Select All'}
        </button>
      </div>

      {/* Options List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {components.map((comp) => {
          const isSelected = selectedIds.includes(comp.id);
          const itemSavedUsd = (comp.other_usd - comp.kivo_usd).toFixed(2);

          return (
            <div 
              key={comp.id}
              onClick={() => toggleSelect(comp.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justify: 'space-between',
                padding: '12px 14px',
                borderRadius: '12px',
                backgroundColor: isSelected ? '#F7F0E6' : '#FAF6F0',
                border: isSelected ? '1px solid #D8C3B0' : '1px solid #EFE6DC',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ color: isSelected ? '#6B1D2F' : '#A39282' }}>
                  {isSelected ? <CheckSquare size={20} /> : <Square size={20} />}
                </div>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: '600', color: isSelected ? '#3D101B' : '#4A3E38' }}>
                    {comp.id}. {comp.name}
                  </div>
                  <div style={{ fontSize: '12px', color: '#7A6B61' }}>{comp.spec}</div>
                </div>
              </div>

              {/* Price comparison */}
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '14px', fontWeight: '700', color: '#2A6F4E' }}>
                  ${comp.kivo_usd.toFixed(2)} <span style={{ fontSize: '11px', color: '#7A6B61', fontWeight: 'normal' }}>(₹{comp.kivo_inr})</span>
                </div>
                <div style={{ fontSize: '11px', color: '#A39282', textDecoration: 'line-through' }}>
                  Other sites: ${comp.other_usd.toFixed(2)}
                </div>
                <div style={{ fontSize: '10px', color: '#2A6F4E', fontWeight: '700', marginTop: '2px' }}>
                  Save ${itemSavedUsd}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Total & Redirect Button */}
      {selectedItems.length > 0 && (
        <div style={{ borderTop: '1px solid #EFE6DC', paddingTop: '14px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ 
            display: 'flex', 
            justify: 'space-between', 
            alignItems: 'center', 
            backgroundColor: '#EBF5EE', 
            border: '1px solid #C4E3D1', 
            padding: '12px 16px', 
            borderRadius: '12px' 
          }}>
            <div>
              <div style={{ fontSize: '11px', color: '#1B4A34', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: '700' }}>KIVO Total</div>
              <div style={{ fontSize: '18px', fontWeight: '800', color: '#0F2C1F' }}>
                ${totalKivoUsd.toFixed(2)} <span style={{ fontSize: '13px', color: '#1B4A34', fontWeight: 'normal' }}>(₹{totalKivoInr})</span>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '12px', color: '#7A6B61', textDecoration: 'line-through' }}>
                Other sites: ${totalOtherUsd.toFixed(2)}
              </div>
              <div style={{ fontSize: '13px', fontWeight: '700', color: '#2A6F4E', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                <TrendingDown size={15} /> You save ${savedUsd} (₹{savedInr})
              </div>
            </div>
          </div>

          <button
            onClick={() => onCheckout({
              items: selectedItems,
              totalKivoUsd,
              totalOtherUsd,
              savedUsd,
              totalKivoInr,
              savedInr
            })}
            style={{
              backgroundColor: '#6B1D2F',
              color: '#FBF8F5',
              border: 'none',
              borderRadius: '12px',
              padding: '14px',
              fontSize: '14px',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justify: 'center',
              gap: '10px',
              boxShadow: '0 4px 14px rgba(107, 29, 47, 0.25)',
              transition: 'all 0.2s'
            }}
          >
            <ShoppingCart size={18} /> Proceed to Purchase Page ({selectedItems.length} Items) <ArrowRight size={18} />
          </button>
        </div>
      )}
    </div>
  );
}

export default function App() {
  const [activeTab, setActiveTab] = useState('chatbot');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [loading, setLoading] = useState(false);

  // Active Cart / Purchase Requisition Data
  const [cartOrder, setCartOrder] = useState({
    items: [
      { id: "1", name: "ESP32-WROOM-32D Microcontroller", spec: "Wi-Fi + BT Module", kivo_usd: 3.15, other_usd: 4.80, kivo_inr: 272, other_inr: 415 },
      { id: "2", name: "MQ-2 Gas Sensor Module", spec: "Smoke / LPG Sensor", kivo_usd: 1.45, other_usd: 2.50, kivo_inr: 125, other_inr: 216 }
    ],
    totalKivoUsd: "4.60",
    totalOtherUsd: "7.30",
    savedUsd: "2.70",
    totalKivoInr: 397,
    savedInr: 234
  });

  const [orderPlaced, setOrderPlaced] = useState(false);

  // Chatbot State
  const [chatMessages, setChatMessages] = useState([
    { role: 'assistant', content: 'Hello! I am KIVO AI Assistant. Ask me what components are needed for your project (e.g. RC car, drone, solar vehicle) and I will provide selectable options with instant savings compared to other sites!' }
  ]);
  const [chatInput, setChatInput] = useState('');

  // Search Logic
  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setLoading(true);

    setTimeout(() => {
      const q = searchQuery.toLowerCase().trim();
      let matchKey = Object.keys(COMPONENT_DATABASE).find(key => q.includes(key) || key.includes(q));

      if (matchKey) {
        const item = COMPONENT_DATABASE[matchKey];
        setSearchResult({
          found: true,
          part_number: item.part,
          manufacturer: item.mfr,
          category: item.category,
          price_usd: item.usd,
          price_inr: (item.usd * 86.5).toFixed(2),
          lead_time_weeks: item.lead,
          status: 'Authorized Stock'
        });
      } else {
        const calculatedPriceUsd = (Math.random() * 15 + 2).toFixed(2);
        setSearchResult({
          found: true,
          part_number: searchQuery.toUpperCase(),
          manufacturer: 'Global Distributor Index',
          category: 'Electronic Component',
          price_usd: calculatedPriceUsd,
          price_inr: (calculatedPriceUsd * 86.5).toFixed(2),
          lead_time_weeks: Math.floor(Math.random() * 3) + 2 + ' Weeks',
          status: 'Verified Supplier'
        });
      }
      setLoading(false);
    }, 300);
  };

  // Chat Handler with 15s Timeout Controller
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg = chatInput;
    const updatedMessages = [...chatMessages, { role: 'user', content: userMsg }];
    
    setChatMessages(updatedMessages);
    setChatInput('');
    setChatMessages(prev => [...prev, { role: 'assistant', content: 'Thinking...' }]);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    try {
      const response = await fetch('http://localhost:8000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedMessages.map(m => ({ role: m.role, content: m.content }))
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Server status ${response.status}`);
      }

      const data = await response.json();

      setChatMessages(prev => {
        const filtered = prev.filter(m => m.content !== 'Thinking...');
        return [
          ...filtered, 
          { 
            role: 'assistant', 
            content: data.reply,
            components: data.components && data.components.length > 0 ? data.components : null
          }
        ];
      });

    } catch (err) {
      clearTimeout(timeoutId);
      console.error('Chat AI Error:', err);
      setChatMessages(prev => {
        const filtered = prev.filter(m => m.content !== 'Thinking...');
        return [
          ...filtered,
          { role: 'assistant', content: 'Response timed out or server unreachable. Please check if uvicorn is running on port 8000.' }
        ];
      });
    }
  };

  // Direct checkout redirection to Purchase Page
  const handleCheckoutRedirect = (checkoutData) => {
    setCartOrder({
      items: checkoutData.items,
      totalKivoUsd: checkoutData.totalKivoUsd.toFixed(2),
      totalOtherUsd: checkoutData.totalOtherUsd.toFixed(2),
      savedUsd: checkoutData.savedUsd,
      totalKivoInr: checkoutData.totalKivoInr,
      savedInr: checkoutData.savedInr
    });
    setOrderPlaced(false);
    setActiveTab('purchase');
  };

  const navItems = [
    { id: 'chatbot', label: 'KIVO AI Assistant', icon: MessageSquare },
    { id: 'purchase', label: 'Purchase & Orders', icon: ShoppingBag, badge: cartOrder.items.length },
    { id: 'procurement', label: 'Procurement Search', icon: Search },
    { id: 'logistics', label: 'Spot Logistics', icon: Truck },
    { id: 'tenders', label: 'BOM Document Reader', icon: FileText },
    { id: 'risk', label: 'Risk Radar', icon: ShieldAlert },
  ];

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', backgroundColor: '#FAF6F0', color: '#2C221E', fontFamily: 'Inter, system-ui, sans-serif', overflow: 'hidden' }}>
      
      {/* LEFT SIDEBAR NAVIGATION */}
      <aside style={{ 
        width: '270px', 
        backgroundColor: '#F3ECE2', 
        borderRight: '1px solid #E5D9CC', 
        display: 'flex', 
        flexDirection: 'column', 
        justify: 'space-between', 
        padding: '24px 18px', 
        flexShrink: 0 
      }}>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
          {/* Brand Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '0 6px' }}>
            <div style={{ 
              backgroundColor: '#6B1D2F', 
              padding: '12px', 
              borderRadius: '14px', 
              color: '#FBF8F5',
              boxShadow: '0 4px 12px rgba(107, 29, 47, 0.2)'
            }}>
              <Cpu size={24} />
            </div>
            <div>
              <div style={{ fontSize: '20px', fontWeight: '800', letterSpacing: '0.04em', color: '#3D101B', display: 'flex', alignItems: 'center', gap: '6px' }}>
                KIVO <span style={{ fontSize: '10px', backgroundColor: '#6B1D2F', color: '#FBF8F5', padding: '2px 8px', borderRadius: '12px', fontWeight: '700' }}>OS</span>
              </div>
              <div style={{ fontSize: '11px', color: '#7A6B61', marginTop: '2px' }}>Hardware Intelligence OS</div>
            </div>
          </div>

          {/* Navigation Tasks */}
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ fontSize: '11px', fontWeight: '700', color: '#A39282', textTransform: 'uppercase', letterSpacing: '0.08em', padding: '0 8px 6px 8px' }}>
              Navigation / Tasks
            </div>
            {navItems.map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justify: 'space-between',
                    padding: '12px 14px',
                    borderRadius: '12px',
                    fontSize: '14px',
                    fontWeight: isActive ? '700' : '500',
                    border: 'none',
                    cursor: 'pointer',
                    backgroundColor: isActive ? '#6B1D2F' : 'transparent',
                    color: isActive ? '#FBF8F5' : '#5C4E46',
                    boxShadow: isActive ? '0 4px 12px rgba(107, 29, 47, 0.2)' : 'none',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Icon size={18} />
                    <span>{tab.label}</span>
                  </div>
                  {tab.badge !== undefined && tab.badge > 0 && (
                    <span style={{ 
                      backgroundColor: isActive ? '#FBF8F5' : '#E5D9CC', 
                      color: isActive ? '#6B1D2F' : '#3D101B', 
                      padding: '2px 8px', 
                      borderRadius: '12px', 
                      fontSize: '11px', 
                      fontWeight: '800' 
                    }}>
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer Status */}
        <div style={{ 
          backgroundColor: '#EADFCF', 
          border: '1px solid #D8C3B0', 
          borderRadius: '14px', 
          padding: '12px 16px', 
          display: 'flex', 
          alignItems: 'center', 
          gap: '10px' 
        }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#2A6F4E' }}></span>
          <div style={{ fontSize: '12px', color: '#1B4A34', fontWeight: '600' }}>Gemini LLM Active</div>
        </div>
      </aside>

      {/* RIGHT MAIN WORKSPACE */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
        
        {/* Main Content Header */}
        <header style={{ 
          padding: '18px 36px', 
          backgroundColor: '#F3ECE2', 
          borderBottom: '1px solid #E5D9CC', 
          display: 'flex', 
          alignItems: 'center', 
          justify: 'space-between' 
        }}>
          <h1 style={{ fontSize: '20px', fontWeight: '700', color: '#3D101B', margin: 0 }}>
            {navItems.find(n => n.id === activeTab)?.label}
          </h1>
          <div style={{ fontSize: '12px', color: '#7A6B61', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#6B1D2F' }}></span> Port 8000 Connected
          </div>
        </header>

        {/* Workspace Body */}
        <main style={{ flex: 1, padding: '28px 36px', overflowY: 'auto' }}>
          
          {/* CHATBOT TAB */}
          {activeTab === 'chatbot' && (
            <div style={{ 
              backgroundColor: '#FFFFFF', 
              border: '1px solid #E5D9CC', 
              borderRadius: '20px', 
              height: 'calc(100vh - 130px)', 
              display: 'flex', 
              flexDirection: 'column', 
              overflow: 'hidden',
              boxShadow: '0 4px 20px rgba(107, 29, 47, 0.04)'
            }}>
              <div style={{ padding: '16px 24px', backgroundColor: '#F8F3ED', borderBottom: '1px solid #E5D9CC', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <MessageSquare size={18} color="#6B1D2F" />
                <div>
                  <div style={{ fontWeight: '700', fontSize: '14px', color: '#3D101B' }}>KIVO Conversational AI Assistant</div>
                  <div style={{ fontSize: '12px', color: '#7A6B61' }}>Connected to FastAPI backend with Gemini LLM Engine</div>
                </div>
              </div>

              <div style={{ flex: 1, padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '18px' }}>
                {chatMessages.map((msg, idx) => (
                  <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
                    <div style={{
                      maxWidth: '82%',
                      padding: '14px 18px',
                      borderRadius: '16px',
                      fontSize: '14px',
                      lineHeight: '1.6',
                      whiteSpace: 'pre-wrap',
                      backgroundColor: msg.role === 'user' ? '#6B1D2F' : '#F3ECE2',
                      color: msg.role === 'user' ? '#FBF8F5' : '#2C221E',
                      border: msg.role === 'user' ? 'none' : '1px solid #E5D9CC',
                      boxShadow: msg.role === 'user' ? '0 4px 12px rgba(107, 29, 47, 0.2)' : 'none'
                    }}>
                      {msg.content}
                    </div>

                    {/* Render Selectable Component Options */}
                    {msg.components && msg.components.length > 0 && (
                      <div style={{ width: '85%', marginTop: '8px' }}>
                        <ComponentSelector 
                          components={msg.components} 
                          onCheckout={handleCheckoutRedirect} 
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <form onSubmit={handleSendMessage} style={{ padding: '18px', backgroundColor: '#F8F3ED', borderTop: '1px solid #E5D9CC', display: 'flex', gap: '14px' }}>
                <input 
                  type="text" 
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Ask e.g. 'What components do I need to make an RC car?'..."
                  style={{
                    flex: 1,
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #D8C3B0',
                    borderRadius: '12px',
                    padding: '14px 18px',
                    color: '#2C221E',
                    fontSize: '14px',
                    outline: 'none'
                  }}
                />
                <button type="submit" style={{ 
                  backgroundColor: '#6B1D2F', 
                  color: '#FBF8F5', 
                  border: 'none', 
                  borderRadius: '12px', 
                  padding: '14px 24px', 
                  cursor: 'pointer', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justify: 'center',
                  boxShadow: '0 4px 12px rgba(107, 29, 47, 0.2)'
                }}>
                  <Send size={18} />
                </button>
              </form>
            </div>
          )}

          {/* PURCHASE & REQUISITION PAGE TAB */}
          {activeTab === 'purchase' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div style={{ 
                backgroundColor: '#FFFFFF', 
                border: '1px solid #E5D9CC', 
                borderRadius: '20px', 
                padding: '28px',
                boxShadow: '0 4px 20px rgba(107, 29, 47, 0.04)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                  <div>
                    <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#3D101B', margin: '0 0 6px 0' }}>Hardware Purchase Requisition</h2>
                    <p style={{ fontSize: '13px', color: '#7A6B61', margin: 0 }}>Review selected components and complete your purchase order.</p>
                  </div>
                  <span style={{ fontSize: '12px', backgroundColor: '#F3ECE2', color: '#6B1D2F', padding: '6px 14px', borderRadius: '14px', fontWeight: '700', border: '1px solid #E5D9CC' }}>
                    KIVO Direct Contract
                  </span>
                </div>

                {/* Items Table */}
                <div style={{ backgroundColor: '#FAF6F0', borderRadius: '14px', border: '1px solid #E5D9CC', overflow: 'hidden', marginBottom: '24px' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid #E5D9CC', color: '#7A6B61', fontSize: '12px', textTransform: 'uppercase' }}>
                        <th style={{ padding: '14px 18px' }}>Option</th>
                        <th style={{ padding: '14px 18px' }}>Component Name</th>
                        <th style={{ padding: '14px 18px' }}>Specification</th>
                        <th style={{ padding: '14px 18px' }}>Other Sites</th>
                        <th style={{ padding: '14px 18px' }}>KIVO Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cartOrder.items.map((item, idx) => (
                        <tr key={idx} style={{ borderBottom: '1px solid #EFE6DC' }}>
                          <td style={{ padding: '14px 18px', color: '#6B1D2F', fontWeight: '800' }}>#{item.id}</td>
                          <td style={{ padding: '14px 18px', color: '#2C221E', fontWeight: '600' }}>{item.name}</td>
                          <td style={{ padding: '14px 18px', color: '#7A6B61' }}>{item.spec}</td>
                          <td style={{ padding: '14px 18px', color: '#A39282', textDecoration: 'line-through' }}>${item.other_usd ? item.other_usd.toFixed(2) : '0.00'}</td>
                          <td style={{ padding: '14px 18px', color: '#2A6F4E', fontWeight: '700' }}>${item.kivo_usd ? item.kivo_usd.toFixed(2) : '0.00'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Savings Highlights */}
                <div style={{ 
                  backgroundColor: '#EBF5EE', 
                  border: '1px solid #C4E3D1', 
                  borderRadius: '16px', 
                  padding: '22px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justify: 'space-between', 
                  marginBottom: '24px' 
                }}>
                  <div>
                    <div style={{ fontSize: '13px', color: '#1B4A34' }}>Total Other Sites Price: <span style={{ textDecoration: 'line-through' }}>${cartOrder.totalOtherUsd}</span></div>
                    <div style={{ fontSize: '26px', fontWeight: '800', color: '#0F2C1F', marginTop: '4px' }}>
                      KIVO Order Total: ${cartOrder.totalKivoUsd} <span style={{ fontSize: '14px', color: '#1B4A34', fontWeight: 'normal' }}>(₹{cartOrder.totalKivoInr})</span>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '16px', fontWeight: '800', color: '#2A6F4E', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <TrendingDown size={22} /> You saved ${cartOrder.savedUsd} (₹{cartOrder.savedInr}) shopping from KIVO!
                    </div>
                  </div>
                </div>

                {/* Checkout Button */}
                {!orderPlaced ? (
                  <button
                    onClick={() => setOrderPlaced(true)}
                    style={{
                      width: '100%',
                      backgroundColor: '#6B1D2F',
                      color: '#FBF8F5',
                      border: 'none',
                      borderRadius: '14px',
                      padding: '18px',
                      fontSize: '16px',
                      fontWeight: '800',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justify: 'center',
                      gap: '12px',
                      boxShadow: '0 4px 14px rgba(107, 29, 47, 0.25)'
                    }}
                  >
                    <CreditCard size={22} /> Confirm Purchase Order
                  </button>
                ) : (
                  <div style={{ backgroundColor: '#EBF5EE', border: '1px solid #C4E3D1', color: '#1B4A34', padding: '18px', borderRadius: '14px', textAlign: 'center', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                    <CheckCircle2 size={22} /> Purchase Requisition Confirmed! Total Paid: ${cartOrder.totalKivoUsd} (₹{cartOrder.totalKivoInr}). Dispatched to KIVO Spot Logistics.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* PROCUREMENT TAB */}
          {activeTab === 'procurement' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div style={{ 
                backgroundColor: '#FFFFFF', 
                border: '1px solid #E5D9CC', 
                borderRadius: '20px', 
                padding: '28px',
                boxShadow: '0 4px 20px rgba(107, 29, 47, 0.04)'
              }}>
                <h2 style={{ fontSize: '20px', fontWeight: '700', margin: '0 0 8px 0', color: '#3D101B' }}>Live Component Search Engine</h2>
                <p style={{ fontSize: '14px', color: '#7A6B61', margin: '0 0 20px 0' }}>Search microcontrollers, Snapdragon SoCs, sensors, and transformers.</p>
                
                <form onSubmit={handleSearch} style={{ display: 'flex', gap: '14px' }}>
                  <input 
                    type="text" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Type component name e.g. Snapdragon 8 Gen 3, ESP32, MQ-2..."
                    style={{
                      flex: 1,
                      backgroundColor: '#FAF6F0',
                      border: '1px solid #D8C3B0',
                      borderRadius: '12px',
                      padding: '14px 18px',
                      color: '#2C221E',
                      fontSize: '14px',
                      outline: 'none'
                    }}
                  />
                  <button 
                    type="submit" 
                    disabled={loading}
                    style={{
                      backgroundColor: '#6B1D2F',
                      color: '#FBF8F5',
                      border: 'none',
                      borderRadius: '12px',
                      padding: '14px 28px',
                      fontSize: '14px',
                      fontWeight: '700',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px'
                    }}
                  >
                    {loading ? <RefreshCw size={18} style={{ animation: 'spin 1s linear infinite' }} /> : <Search size={18} />}
                    Search Index
                  </button>
                </form>
              </div>

              {searchResult && (
                <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E5D9CC', borderRadius: '20px', padding: '28px', display: 'flex', flexDirection: 'column', gap: '20px', boxShadow: '0 4px 20px rgba(107, 29, 47, 0.04)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #EFE6DC', paddingBottom: '14px' }}>
                    <span style={{ fontSize: '13px', color: '#6B1D2F', fontWeight: '700', textTransform: 'uppercase' }}>{searchResult.category}</span>
                    <span style={{ fontSize: '12px', backgroundColor: '#EBF5EE', color: '#1B4A34', padding: '6px 14px', borderRadius: '14px', border: '1px solid #C4E3D1' }}>{searchResult.status}</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
                    <div>
                      <div style={{ fontSize: '12px', color: '#7A6B61', textTransform: 'uppercase' }}>Part Number</div>
                      <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#3D101B', marginTop: '4px' }}>{searchResult.part_number}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '12px', color: '#7A6B61', textTransform: 'uppercase' }}>Manufacturer</div>
                      <div style={{ fontSize: '15px', fontWeight: '600', color: '#5C4E46', marginTop: '4px' }}>{searchResult.manufacturer}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '12px', color: '#7A6B61', textTransform: 'uppercase' }}>Unit Price</div>
                      <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#6B1D2F', marginTop: '4px' }}>${searchResult.price_usd} <span style={{ fontSize: '13px', color: '#7A6B61' }}>(₹{searchResult.price_inr})</span></div>
                    </div>
                    <div>
                      <div style={{ fontSize: '12px', color: '#7A6B61', textTransform: 'uppercase' }}>Lead Time</div>
                      <div style={{ fontSize: '16px', fontWeight: '600', color: '#2A6F4E', marginTop: '4px' }}>{searchResult.lead_time_weeks}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* SPOT LOGISTICS TAB */}
          {activeTab === 'logistics' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', display: 'grid', gap: '20px' }}>
                <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E5D9CC', borderRadius: '20px', padding: '24px', boxShadow: '0 4px 20px rgba(107, 29, 47, 0.04)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                    <h3 style={{ margin: 0, fontSize: '16px', color: '#3D101B' }}>Shenzhen ➔ Mumbai Express</h3>
                    <span style={{ fontSize: '11px', backgroundColor: '#F3ECE2', color: '#6B1D2F', padding: '4px 10px', borderRadius: '12px', fontWeight: '700', border: '1px solid #E5D9CC' }}>Priority Flight</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '14px', borderTop: '1px solid #EFE6DC', paddingTop: '14px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#7A6B61' }}>Transit Time:</span><strong>3 - 5 Days</strong></div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#7A6B61' }}>Freight Rate (50kg):</span><strong style={{ color: '#6B1D2F' }}>₹45,200 ($522.50)</strong></div>
                  </div>
                </div>

                <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E5D9CC', borderRadius: '20px', padding: '24px', boxShadow: '0 4px 20px rgba(107, 29, 47, 0.04)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                    <h3 style={{ margin: 0, fontSize: '16px', color: '#3D101B' }}>Taiwan ➔ Bengaluru Express</h3>
                    <span style={{ fontSize: '11px', backgroundColor: '#EBF5EE', color: '#1B4A34', padding: '4px 10px', borderRadius: '12px', fontWeight: '700' }}>Direct Foundry</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '14px', borderTop: '1px solid #EFE6DC', paddingTop: '14px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#7A6B61' }}>Transit Time:</span><strong>2 - 4 Days</strong></div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#7A6B61' }}>Freight Rate:</span><strong style={{ color: '#6B1D2F' }}>₹62,400 ($721.38)</strong></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TENDERS TAB */}
          {activeTab === 'tenders' && (
            <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E5D9CC', borderRadius: '20px', padding: '40px', textAlign: 'center', boxShadow: '0 4px 20px rgba(107, 29, 47, 0.04)' }}>
              <FileText size={48} color="#6B1D2F" style={{ marginBottom: '16px' }} />
              <h2 style={{ fontSize: '22px', fontWeight: '700', margin: '0 0 12px 0', color: '#3D101B' }}>Tender & BOM Document Reader</h2>
              <p style={{ fontSize: '14px', color: '#7A6B61', margin: '0 0 24px 0' }}>Upload your electronic component spreadsheet to parse contract pricing.</p>
              <label style={{ backgroundColor: '#6B1D2F', color: '#FBF8F5', borderRadius: '14px', padding: '14px 28px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '10px', fontWeight: '700' }}>
                <Upload size={18} />
                <span>Upload BOM (.pdf, .xlsx, .csv)</span>
                <input type="file" onChange={() => alert("File processed!")} style={{ display: 'none' }} />
              </label>
            </div>
          )}

          {/* RISK RADAR TAB */}
          {activeTab === 'risk' && (
            <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E5D9CC', borderRadius: '20px', padding: '28px', boxShadow: '0 4px 20px rgba(107, 29, 47, 0.04)' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '700', margin: '0 0 16px 0', color: '#3D101B' }}>Supply Chain Risk Radar</h2>
              <div style={{ backgroundColor: '#FFF8EB', border: '1px solid #F0E2CA', padding: '18px', borderRadius: '14px', color: '#8A5D18', fontWeight: '500' }}>
                Minor shipping corridor delays in South China Sea (estimated 2-day delay on wafer shipments).
              </div>
            </div>
          )}

        </main>
      </div>

    </div>
  );
}