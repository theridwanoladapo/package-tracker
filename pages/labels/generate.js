/* eslint-disable @next/next/no-img-element */
import Head from 'next/head'
import Link from 'next/link'
import { useState } from 'react'
import styles from '../../styles/Home.module.css'
import bwipjs from 'bwip-js'
import * as htmlToImage from 'html-to-image'

export default function GenerateLabel() {
	const [ preview, setPreview ] = useState({
		success : false
	})

	// Handle the submit event on form submit.
	const handleSubmit = async (event) => {
		// Stop the form from submitting and refreshing the page.
		event.preventDefault()

		const form = event.target

		// Get data from the form
		const data = {
			type: form.type.value,
			sender: form.sender.value,
			receiver: form.receiver.value,
			size: form.size.value,
			weight: form.weight.value,
		}

		// Send the form data to our API and get a response.
		const response = await fetch('/api/generate', {
			// Body of the request is the JSON data we created above.
			body: JSON.stringify(data),
			// Tell the server we're sending JSON.
			headers: {
				'Content-Type': 'application/json',
			},
			// The method is POST because we are sending data.
			method: 'POST',
		})

		// Get the response data from server as JSON.
		// If server returns the name submitted, that means the form works.
		const result = await response.json()
		// console.log(result.result_data)
		const preview = result.result_data
		setPreview(preview)

		try {
			const response = await fetch('/api/tracks/get', {
				headers: { 'Content-Type': 'application/json' },
				method: 'GET',
			})
			const result = await response.json()
			const track = result.track

			let char = '?'
			let ai = 420
			let zip5 = preview.receiver_data.zip5
			let num = `${char}${ai}${zip5}${char}${track.trackNum}`
			console.log(num)
			// The return value is the canvas element
			// await bwipjs.toCanvas('mycanvas', {
			// 	bcid:        'code128',
			// 	text:        num,
			// 	scale:       2,	// 3x scaling factor
			// 	height:      20,	// Bar height, in millimeters
			// 	includetext: false,	// Show human-readable text
			// 	textxalign:  'center',	// Always good to set this
			// });

			await bwipjs.toBuffer({ bcid:'qrcode', text:'0123456789' })
			.then((png) => {
				console.log(png.toString('base64'))
				document.getElementById('barcode').innerHTML = 'data:image/png;base64,' + png.toString('base64')
			}).catch((err) => {
				console.log(err)
				document.getElementById('barcode').innerHTML = err;
			})
		} catch (e) {
			// `e` may be a string or Error object
		}
	
	}

	const [ type, setType ] = useState('priority')
	const [ size, setSize ] = useState('4x6')

	// Handle label type change
	const handleTypeChange = event => {
		console.log(event.target.value)
		setType(event.target.value)
	}
	
	// Handle page size change
	const handleSizeChange = event => {
		console.log(event.target.value)
		setSize(event.target.value)
	}

	const handleLabelDownload = event => {
		let label = document.getElementById('my-label')
		label.style.width = '4in'
		label.style.height = '6in'
		htmlToImage.toPng(label)
		.then(function (dataUrl) {
			var link = document.createElement('a');
			link.download = 'label-4x6in.png';	
			link.href = dataUrl;
			link.click();
		});
	}

	return (
		<div className="container">
			<Head>
				<title>Package Tracker</title>
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<meta name="description" content="Instantly generate your trackings and download in png." />
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<section className="section">
				<div className="section-header mt-2">
					<h1 className={styles.title}>
						<Link href="/">
							Package Tracker
						</Link>
					</h1>
				</div>
				<div className="section-body">
					<h2 className="section-title">Get started by generating tracking label.</h2>

					<div className="row">
						
						<div className="col-md-7">
							<div className="card">
								<div className="card-header">
									<h4>Generate Tracking Label</h4>
								</div>
								<div className="card-body">
									<form onSubmit={handleSubmit}>
										<div className="form-group">
											<label className="form-control-label">Type <code>*</code></label>
											<div>
												<div className="form-check form-check-inline">
													<input className="form-check-input" type="radio" id="priority" value="priority" 
													name="type" onChange={handleTypeChange} checked={type === 'priority'} />
													<label className="form-check-label" htmlFor="priority">Priority</label>
												</div>
												<div className="form-check form-check-inline">
													<input className="form-check-input" type="radio" id="express" value="express" 
													name="type" onChange={handleTypeChange} checked={type === 'express'} />
													<label className="form-check-label" htmlFor="express">Mail Express</label>
												</div>
												<div className="form-check form-check-inline">
													<input className="form-check-input" type="radio" id="signature" value="signature" 
													name="type" onChange={handleTypeChange} checked={type === 'signature'} />
													<label className="form-check-label" htmlFor="signature">Signature</label>
												</div>
											</div>
										</div>

										<div className="row">
											<div className="form-group col-lg-6">
												<label htmlFor="sender" className="form-control-label">Sender <code>*</code></label>
												<textarea className="form-control h-auto" id="sender" rows="6" required></textarea>
											</div>
											<div className="form-group col-lg-6">
												<label htmlFor="receiver" className="form-control-label">Receiver <code>*</code></label>
												<textarea className="form-control h-auto" id="receiver" rows="6" required></textarea>
											</div>
										</div>

										<div className="form-group">
											<label className="form-control-label">Package Weight (lb) <code>*</code></label>
											<input className="form-control" type="number" name="weight" id="weight" required />
										</div>
										
										<div className="form-group">
											<label className="form-control-label">Label Size <code>*</code></label>
											<div>
												<div className="form-check form-check-inline">
													<input className="form-check-input" type="radio" id="4x6" value="4x6" 
													name="size" onChange={handleSizeChange} checked={size === '4x6'} />
													<label className="form-check-label" htmlFor="4x6">4 x 6</label>
												</div>
												<div className="form-check form-check-inline">
													<input className="form-check-input" type="radio" id="8x11" value="8x11" 
													name="size" onChange={handleSizeChange} checked={size === '8x11'} />
													<label className="form-check-label" htmlFor="8x11">8 x 11</label>
												</div>
											</div>
										</div>

										<div className="form-group mt-3">
											<button className="btn btn-primary btn-block" type="submit">Preview</button>
										</div>
									</form>
								</div>
								{/* <hr />
								<div className="card-body">
									<div className="form-group">
										<label>Upload CSV</label>
										<input type="file" className="form-control" />
									</div>
									<div className="form-group mt-3">
										<button className="btn btn-primary btn-block" type="submit">Preview</button>
									</div>
								</div> */}
							</div>
						</div>
						
						<div className="col-md-5">
							<div className="card">
								<div className="card-header">
									<h4>Preview</h4>
								</div>
								<div className="card-body">
									{ preview.success 
									? <div>
										<div>
											<button className="btn btn-primary btn-block" type="button" onClick={handleLabelDownload}>Download</button>
										</div>
										<div id="my-label" className="w-auto border border-2 bg-white p-0">
											<div className="w-auto border border-2 border-dark text-dark bg-white p-0 mx-0" style={{ fontFamily: 'Arial', fontSize: '12px' }}>
												<div className="row">
													<div className="col-12">
														<img src="/print-images/priority.jpg" alt="Logo" width="100%" 
														style={{ borderBottom: '4px solid black', margin: '0px' }} />
													</div>
													<div className="col-12">
														<img src="/print-images/priority2.png" alt="Logo" width="100%" 
														style={{ borderBottom: '4px solid black', margin: '0px' }} />
													</div>
													<div className="col-6 p-4">
														<address>
															{ preview.sender_data.name ? preview.sender_data.name.toUpperCase() : null }<br/>
															{ preview.sender_data.street1 ? preview.sender_data.street1 : null }
															{ preview.sender_data.street2 ? ' '+preview.sender_data.street2 : null }<br/>
															{ preview.sender_data.city ? ' '+preview.sender_data.city : null }
															{ preview.sender_data.state ? ' '+preview.sender_data.state : null }
															{ preview.sender_data.zip5 ? ' '+preview.sender_data.zip5 : null }
															{ preview.sender_data.zip4 ? '-'+preview.sender_data.zip4 : null }
														</address>
													</div>
													<div className="col-6 p-4">
														<address className="text-right float-end">
															Ship Date: { preview.date }<br/>
															Weight: { preview.weight +' lb' }
														</address>
													</div>
													<div className="col-8 offset-2 d-flex align-items-center justify-items-center">
														<address>
															{ preview.receiver_data.name ? preview.receiver_data.name.toUpperCase() : null }<br/>
															{ preview.receiver_data.street1 ? preview.receiver_data.street1 : null }
															{ preview.receiver_data.street2 ? ' '+preview.receiver_data.street2 : null }<br/>
															{ preview.receiver_data.city ? ' '+preview.receiver_data.city : null }
															{ preview.receiver_data.state ? ' '+preview.receiver_data.state : null }
															{ preview.receiver_data.zip5 ? ' '+preview.receiver_data.zip5 : null }
															{ preview.receiver_data.zip4 ? '-'+preview.receiver_data.zip4 : null }
														</address>
													</div>
													<div className="col-12 text-center">
														<div id="barcode" className="px-4" style={{ borderTop: '4px solid black', margin: '0px' }}>
															<div className="fw-bold">USPS TRACKING #EP</div>
															{/* <img id="myimg" alt="Logo" width="100" />
															<canvas id="mycanvas"></canvas> */}
															<div className="fw-bold">9205 5900 9001 1319 7279 0376 03</div>
														</div>
													</div>
													<div className="col-12 text-center">
														<div style={{ borderTop: '4px solid black', margin: '0px' }}>
															<img src="/print-images/shippo.jpg" alt="Logo" width="100" />
														</div>
													</div>
												</div>
											</div>
										</div>
									</div>
									: <div className="page-error">
										<div className="page-inner">
											<h3 className="text-danger">Error !</h3>
											<div className="page-description mb-5 text-danger">
												Address not valid. <br/> Atleast one of the address you submitted is invalid.
											</div>
										</div>
									</div>
									}
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>
		</div>
	)
}
