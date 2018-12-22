import { reduxForm } from 'redux-form'
import { connect } from 'react-redux'

export const connectReduxForm = (formName, formClass, mapStateToProps, mapDispatchToProps) => 
  connect(mapStateToProps, mapDispatchToProps)(reduxForm({ form: formName })(formClass))
