'use client'

import { useState } from 'react';
import Link from 'next/link';
import { useLocationStore } from '@/store/location-store'
import { toast } from 'sonner';
import { addItemToPlatter, getPlatters, createPlatter } from '@/app/actions/platter';
import AddToCartButton from '@/components/product/AddToCartButton';
import { createClient } from '@/lib/supabase/client';
import deliverySlots from '@/data/delivery-slots.json';
import { ArrowLeft } from 'lucide-react';

type ProductWeight = {
  id: string;
  weight: string;
  price: number;
  discountPrice?: number | null;
}

type Product = {
  id: string;
  name: string;
  slug: string;
  category: { name: string; slug: string };
  description: string | null;
  freshnessNotes: string | null;
  freshnessDate: Date | string | null;
  cutTypes: string | null;
  imageUrl: string;
  weights: ProductWeight[];
}

export default function ProductClient({ product }: { product: Product }) {
  const { city } = useLocationStore();
  const [checkPincode, setCheckPincode] = useState('');
  const [quantity, setQuantity] = useState(0); // Note: Current AddToCart expects initial qty 0 sometimes, but usually 1 is better for UX. Keeping 0 as per logic.
  const [isSlotDropdownOpen, setIsSlotDropdownOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(deliverySlots[0]);

  const cutOptions = product.cutTypes ? product.cutTypes.split(',').map(s => s.trim()) : [];
  const [selectedCut, setSelectedCut] = useState(cutOptions.length > 0 ? cutOptions[0] : '');

  // Ensure selectedWeight has a valid structure even if weights are empty
  const [selectedWeight, setSelectedWeight] = useState<ProductWeight>(
    product.weights.length > 0
      ? product.weights[0]
      : { id: 'default', weight: 'N/A', price: 0 }
  );

  const handleCheckAvailability = () => {
    if (!checkPincode) {
      toast.error('Please enter a pincode');
      return;
    }
    // Mock check
    if (checkPincode.startsWith('5')) {
      toast.success(`Available in ${city} (${checkPincode})`);
    } else {
      toast.error(`Not available in ${checkPincode}`);
    }
  }

  const handleIncrement = () => setQuantity(prev => prev + 1);
  const handleDecrement = () => setQuantity(prev => Math.max(0, prev - 1));

  const handleAddToPlatter = async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      toast.error('Please login to add to platter');
      return;
    }

    try {
      let platters = await getPlatters();
      let targetPlatterId;

      if (platters.length === 0) {
        const result = await createPlatter('My Weekly Platter');
        if (result.success && result.platter) {
          targetPlatterId = result.platter.id;
        } else {
          toast.error('Failed to create platter');
          return;
        }
      } else {
        targetPlatterId = platters[0].id;
      }

      const res = await addItemToPlatter(
        targetPlatterId,
        product.id,
        selectedWeight.id,
        null,
        quantity || 1
      );

      if (res.success) {
        toast.success('Added to your platter!');
      } else {
        toast.error('Failed to add to platter');
      }
    } catch (error) {
      console.error(error);
      toast.error('An error occurred');
    }
  };

  // Custom Styles
  const titleStyle = {
    fontFamily: 'noto_sansbold',
    color: '#333',
    fontSize: '28px',
    marginTop: '0'
  };

  const labelStyle = {
    fontFamily: 'noto_sansbold',
    color: '#666',
    fontSize: '14px',
    marginBottom: '5px'
  };

  const priceStyle = {
    fontFamily: 'noto_sansbold',
    color: '#f25648',
    fontSize: '24px'
  };

  const sectionStyle = {
    marginBottom: '20px',
    paddingBottom: '20px',
    borderBottom: '1px solid #eee'
  };

  const controlBtnStyle = {
    border: '1px solid #ddd',
    background: '#fff',
    width: '40px',
    height: '40px',
    lineHeight: '38px',
    textAlign: 'center' as const,
    display: 'inline-block',
    fontSize: '18px',
    color: '#666',
    cursor: 'pointer',
    textDecoration: 'none'
  };

  const inputStyle = {
    border: '1px solid #ddd',
    borderLeft: 'none',
    borderRight: 'none',
    height: '40px',
    width: '60px',
    textAlign: 'center' as const,
    display: 'inline-block',
    verticalAlign: 'top'
  };

  return (
    <div style={{ background: '#f9f9f9', paddingBottom: '60px' }}>
      <div className="breadcrumps-bg">
        <div className="container">
          <ol className="breadcrumb">
            <li><Link href="/">Home</Link></li>
            <li><Link href={`/category/${product.category.slug}`}>{product.category.name}</Link></li>
            <li className="active">{product.name}</li>
          </ol>
        </div>
      </div>

      <div className="container" style={{ marginTop: '40px' }}>
        <div className="row">

          {/* Left Column: Image & Description */}
          <div className="col-md-6 mb-4">
            <div style={{ background: '#fff', padding: '20px', border: '1px solid #e5e5e5', marginBottom: '20px' }}>
              <img src={product.imageUrl} alt={product.name} className="img-responsive center-block" style={{ maxHeight: '400px' }} />
            </div>
            {/* Certifications row */}
            <div className="row text-center hidden-xs" style={{ marginBottom: '20px' }}>
              <div className="col-xs-4">
                <img src="/images/guarentee.png" alt="fresh" style={{ maxHeight: '40px' }} />
                <p style={{ fontSize: '11px', color: '#999', marginTop: '5px' }}>100% Fresh</p>
              </div>
              <div className="col-xs-4">
                <img src="/images/transport.png" alt="delivery" style={{ maxHeight: '40px' }} />
                <p style={{ fontSize: '11px', color: '#999', marginTop: '5px' }}>Fast Delivery</p>
              </div>
              <div className="col-xs-4">
                <img src="/images/check-img.png" alt="checked" style={{ maxHeight: '40px' }} />
                <p style={{ fontSize: '11px', color: '#999', marginTop: '5px' }}>Quality Checked</p>
              </div>
            </div>

            {/* Description Card (Now below image) */}
            <div style={{ background: '#fff', padding: '20px', border: '1px solid #e5e5e5' }}>
              <h3 style={{ ...titleStyle, fontSize: '18px', marginBottom: '15px' }}>Description</h3>
              <div style={{ color: '#666', fontFamily: 'noto_sansregular', lineHeight: '1.6' }}>
                {product.description ? (
                  product.description.split('\n').map((paragraph, index) => <p key={index} style={{ marginBottom: '10px' }}>{paragraph}</p>)
                ) : (
                  <p>No description available.</p>
                )}
              </div>
              {product.freshnessNotes && (
                <div style={{ marginTop: '15px', padding: '10px', background: '#f5fff5', border: '1px solid #d0e9c6', borderRadius: '4px' }}>
                  <strong style={{ color: '#3c763d' }}>Freshness Note:</strong> {product.freshnessNotes}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Details */}
          <div className="col-md-6">
            <div style={{ background: '#fff', padding: '30px', border: '1px solid #e5e5e5' }}>
              <h1 style={titleStyle}>{product.name}</h1>
              <p style={{ color: '#999', fontFamily: 'noto_sansregular', fontSize: '14px' }}>
                Category: <Link href={`/category/${product.category.slug}`} style={{ color: '#f25648' }}>{product.category.name}</Link>
              </p>

              {/* Price Section */}
              <div style={sectionStyle}>
                {selectedWeight.discountPrice ? (
                  <div>
                    <span style={{ textDecoration: 'line-through', color: '#999', fontSize: '16px', marginRight: '10px' }}>
                      &#8377; {selectedWeight.price}
                    </span>
                    <span style={priceStyle}>
                      &#8377; {selectedWeight.discountPrice}
                    </span>
                  </div>
                ) : (
                  <span style={priceStyle}>&#8377; {selectedWeight.price}</span>
                )}
              </div>

              {/* Weight Selection */}
              <div style={{ ...sectionStyle, borderBottom: 'none', paddingBottom: '0' }}>
                <p style={labelStyle}>Pack Size</p>
                <select
                  className="form-control"
                  style={{ height: '40px', fontSize: '15px' }}
                  value={selectedWeight.id}
                  onChange={(e) => {
                    const w = product.weights.find(x => x.id === e.target.value);
                    if (w) setSelectedWeight(w);
                  }}
                >
                  {product.weights.map((w) => (
                    <option key={w.id} value={w.id}>{w.weight} - &#8377; {w.discountPrice || w.price}</option>
                  ))}
                </select>
              </div>

              {/* Cut Type Selection */}
              {cutOptions.length > 0 && (
                <div style={{ ...sectionStyle, borderBottom: 'none', paddingTop: '10px', paddingBottom: '0' }}>
                  <p style={labelStyle}>Preferred Cut</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                    {cutOptions.map((opt, idx) => (
                      <button
                        key={idx}
                        className={`btn ${selectedCut === opt ? 'btn-danger' : 'btn-default'}`}
                        style={selectedCut === opt ? { background: '#f25648', borderColor: '#f25648', color: '#fff' } : {}}
                        onClick={() => setSelectedCut(opt)}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div style={{ ...sectionStyle, borderBottom: 'none', paddingTop: '20px' }}>
                <div className="row">
                  <div className="col-xs-6">
                    <p style={labelStyle}>Quantity</p>
                    <div style={{ display: 'inline-block' }}>
                      <a onClick={(e) => { e.preventDefault(); handleDecrement(); }} style={controlBtnStyle}>-</a>
                      <input type="text" value={quantity} readOnly style={inputStyle} className="form-control" />
                      <a onClick={(e) => { e.preventDefault(); handleIncrement(); }} style={controlBtnStyle}>+</a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Local Check */}
              <div style={{ ...sectionStyle }}>
                <p style={labelStyle}>Check Availability</p>
                <div className="input-group" style={{ maxWidth: '300px' }}>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter Pincode"
                    value={checkPincode}
                    onChange={(e) => setCheckPincode(e.target.value)}
                    style={{ height: '40px' }}
                  />
                  <span className="input-group-btn">
                    <button className="btn btn-default" type="button" onClick={handleCheckAvailability} style={{ height: '40px' }}>Check</button>
                  </span>
                </div>
              </div>

              {/* Delivery Time */}
              <div style={{ ...sectionStyle, borderBottom: 'none' }}>
                <p style={labelStyle}>Delivery Slot</p>
                <select
                  className="form-control"
                  style={{ height: '40px' }}
                  value={selectedSlot.id}
                  onChange={(e) => {
                    const slot = deliverySlots.find(s => s.id === e.target.value);
                    if (slot) setSelectedSlot(slot);
                  }}
                >
                  {deliverySlots.map(slot => (
                    <option key={slot.id} value={slot.id}>{slot.label}</option>
                  ))}
                </select>
              </div>

              {/* Action Buttons */}
              <div style={{ marginTop: '30px' }}>
                <AddToCartButton product={product} externalWeightId={selectedWeight.id} cutType={selectedCut} />

                <div style={{ marginTop: '15px' }}>
                  <a href="#" className="btn btn-default btn-block" style={{ color: '#666', border: '1px solid #ddd' }} onClick={(e) => { e.preventDefault(); handleAddToPlatter(); }}>
                    Add to My Platter
                  </a>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

